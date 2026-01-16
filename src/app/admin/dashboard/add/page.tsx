'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function AddCustomer() {
    const [formData, setFormData] = useState({
        name: '',
        photoUrl: '',
        phoneNumber: '',
        password: '',
        bloodType: '',

        extraInfo: '',
    });
    const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; phone: string }[]>([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [socialMedia, setSocialMedia] = useState<{ platform: string; url: string }[]>([]);
    const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
    const [generatedQR, setGeneratedQR] = useState('');
    // const [generatedPIN, setGeneratedPIN] = useState('');
    const [userId, setUserId] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,

                extraInfo: { note: formData.extraInfo }, // Store simple note for now
                emergencyContacts,
                socialMedia,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            setUserId(data.id);
            // setGeneratedPIN(data.pin);

            // Generate QR Code
            const url = `${window.location.origin}/${data.id}`;
            const qrDataUrl = await QRCode.toDataURL(url);
            setGeneratedQR(qrDataUrl);
        } else {
            alert('Failed to create user');
        }
    };

    const downloadQR = () => {
        const link = document.createElement('a');
        link.href = generatedQR;
        link.download = `qrcode-${formData.name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const addContact = () => {
        if (newContact.name && newContact.phone) {
            setEmergencyContacts([...emergencyContacts, newContact]);
            setNewContact({ name: '', phone: '' });
        }
    };

    const removeContact = (index: number) => {
        const updated = [...emergencyContacts];
        updated.splice(index, 1);
        setEmergencyContacts(updated);
    };

    const addSocial = () => {
        if (newSocial.platform && newSocial.url) {
            setSocialMedia([...socialMedia, newSocial]);
            setNewSocial({ platform: '', url: '' });
        }
    };

    const removeSocial = (index: number) => {
        const updated = [...socialMedia];
        updated.splice(index, 1);
        setSocialMedia(updated);
    };

    return (
        <div className="min-h-screen text-white p-8">
            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>

                {!generatedQR ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Photo URL</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Phone Number (Login ID)</label>
                            <input
                                type="tel"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Password</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Set user password"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Blood Type</label>
                            <select
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.bloodType}
                                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                            >
                                <option value="">Select...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="0+">0+</option>
                                <option value="0-">0-</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Extra Info</label>
                            <textarea
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 outline-none"
                                value={formData.extraInfo}
                                onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
                            />
                        </div>

                        {/* Emergency Contacts Section - Reusing style from ProfileEditor but adapting for creation page */}
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <label className="block text-gray-400 text-sm mb-3 uppercase font-bold">Alternative Contacts</label>

                            {emergencyContacts.map((contact, idx) => (
                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                    <div className="flex-1 bg-gray-700 p-2 rounded text-sm text-gray-300 border border-gray-600">
                                        <span className="text-gray-500 text-xs block">Rel/Name</span>
                                        {contact.name}
                                    </div>
                                    <div className="flex-1 bg-gray-700 p-2 rounded text-sm text-gray-300 border border-gray-600">
                                        <span className="text-gray-500 text-xs block">Phone</span>
                                        {contact.phone}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeContact(idx)}
                                        className="text-red-400 hover:text-red-300 px-2 font-bold bg-red-400/10 h-10 w-10 rounded hover:bg-red-400/20 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Relation (e.g. Father)"
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                                    value={newContact.name}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                                    value={newContact.phone}
                                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                />
                                <button
                                    onClick={addContact}
                                    type="button"
                                    className="bg-green-600 hover:bg-green-500 text-white px-4 rounded font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newContact.name || !newContact.phone}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {/* Social Media Section moved inside form */}
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <label className="block text-gray-400 text-sm mb-3 uppercase font-bold">Social Media Accounts</label>

                            {socialMedia.map((social, idx) => (
                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                    <div className="flex-1 bg-gray-700 p-2 rounded text-sm text-gray-300 border border-gray-600">
                                        <span className="text-gray-500 text-xs block">Platform</span>
                                        {social.platform}
                                    </div>
                                    <div className="flex-1 bg-gray-700 p-2 rounded text-sm text-gray-300 border border-gray-600 truncate">
                                        <span className="text-gray-500 text-xs block">URL</span>
                                        {social.url}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSocial(idx)}
                                        className="text-red-400 hover:text-red-300 px-2 font-bold bg-red-400/10 h-10 w-10 rounded hover:bg-red-400/20 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-2 mt-2">
                                <select
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                                    value={newSocial.platform}
                                    onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}
                                >
                                    <option value="">Select Platform</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Website">Website</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Username or Link"
                                    className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
                                    value={newSocial.url}
                                    onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                                />
                                <button
                                    onClick={addSocial}
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newSocial.platform || !newSocial.url}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold transition transform hover:scale-105 mt-6"
                        >
                            Create & Generate QR
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-green-400 mb-4">Success! User Created.</h2>

                        <div className="bg-gray-700/50 p-4 rounded-xl mb-6 inline-block border border-gray-600 text-left">
                            <p className="text-sm text-gray-400 mb-2">Login Credentials:</p>
                            <p className="text-white"><span className="text-gray-500 w-20 inline-block">Phone:</span> {formData.phoneNumber}</p>
                            <p className="text-white"><span className="text-gray-500 w-20 inline-block">Password:</span> {formData.password}</p>
                        </div>

                        <div className="flex justify-center mb-6">
                            <img src={generatedQR} alt="QR Code" className="border-4 border-white rounded-lg" />
                        </div>
                        <div className="space-x-4">
                            <button
                                onClick={downloadQR}
                                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-bold transition"
                            >
                                Download QR Code
                            </button>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-bold transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );
}
