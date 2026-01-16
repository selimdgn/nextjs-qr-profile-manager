'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileEditorProps {

    user: {
        id: string;
        name: string;
        phoneNumber?: string;
        bloodType: string;
        photoUrl: string;
        userNote?: string;
        emergencyContacts?: string;
        socialMedia?: string;
    };
    isOwner: boolean;
}

type EmergencyContact = {
    name: string;
    phone: string;
};

type SocialMedia = {
    platform: string;
    url: string;
};

export default function ProfileEditor({ user, isOwner }: ProfileEditorProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Parse initial contacts
    let initialContacts: EmergencyContact[] = [];
    try {
        if (user.emergencyContacts) {
            initialContacts = JSON.parse(user.emergencyContacts);
        }
    } catch (e) { }

    let initialSocials: SocialMedia[] = [];
    try {
        if (user.socialMedia) {
            initialSocials = JSON.parse(user.socialMedia);
        }
    } catch (e) { }

    const [formData, setFormData] = useState({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
        bloodType: user.bloodType,
        photoUrl: user.photoUrl,
        userNote: user.userNote || '',
    });

    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(initialContacts);
    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(initialSocials);

    // Temp state for new contact input
    const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

    const router = useRouter();

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/users/${user.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    emergencyContacts: emergencyContacts, // Send as object, API will stringify
                    socialMedia: socialMedia
                }),
            });

            if (res.ok) {
                setIsEditing(false);
                router.refresh();
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating profile');
        }
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

    if (!isOwner) {
        // If not owner, just show the Note if it exists (Contacts are shown in parent)
        return (
            <div className="w-full">
                <div className="bg-white/5 rounded-xl p-4 mb-4 text-left border border-white/5">
                    {user.userNote ? (
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{user.userNote}</p>
                    ) : (
                        <p className="text-gray-300 text-sm italic opacity-80">Araç kullanıcısı bir not bırakmadı.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* View Mode */}
            {!isEditing && (
                <div className="relative group">
                    <div className="bg-white/5 rounded-xl p-4 mb-4 text-left border border-white/5 border-dashed border-gray-600 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setIsEditing(true)}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-blue-400 uppercase tracking-widest font-bold">Your Note & Info</span>
                            <span className="text-xs text-gray-500">Tap to Edit</span>
                        </div>
                        {user.userNote ? (
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{user.userNote}</p>
                        ) : (
                            <p className="text-gray-500 text-sm italic">Add a personal note...</p>
                        )}
                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg text-sm font-bold border border-blue-600/30 mb-6 transition"
                    >
                        Edit Full Profile
                    </button>
                </div>
            )}

            {/* Edit Mode Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl my-auto">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Edit Profile</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs mb-1 uppercase">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 uppercase">Photo URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm"
                                    value={formData.photoUrl}
                                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 uppercase">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs mb-1 uppercase">Blood Type</label>
                                <select
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.bloodType}
                                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                >
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

                            {/* Emergency Contacts Section */}
                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <label className="block text-gray-400 text-xs mb-3 uppercase text-center font-bold">Alternative Contacts</label>

                                {emergencyContacts.map((contact, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <div className="flex-1 bg-gray-800 p-2 rounded text-sm text-gray-300">{contact.name}</div>
                                        <div className="flex-1 bg-gray-800 p-2 rounded text-sm text-gray-300">{contact.phone}</div>
                                        <button onClick={() => removeContact(idx)} className="text-red-400 hover:text-red-300 px-2 font-bold">✕</button>
                                    </div>
                                ))}

                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Yakınlık (örn. Baba)"
                                        className="flex-1 bg-black/50 border border-gray-700 rounded p-2 text-xs text-white"
                                        value={newContact.name}
                                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Numara"
                                        className="flex-1 bg-black/50 border border-gray-700 rounded p-2 text-xs text-white"
                                        value={newContact.phone}
                                        onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                    />
                                    <button
                                        onClick={addContact}
                                        type="button"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded font-bold text-lg"
                                        disabled={!newContact.name || !newContact.phone}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Social Media Section */}
                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <label className="block text-gray-400 text-xs mb-3 uppercase text-center font-bold">Social Media</label>

                                {socialMedia.map((social, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2 items-center">
                                        <div className="flex-1 bg-gray-800 p-2 rounded text-sm text-gray-300 border border-gray-700">
                                            <span className="text-gray-500 text-[10px] block uppercase">Platform</span>
                                            {social.platform}
                                        </div>
                                        <div className="flex-1 bg-gray-800 p-2 rounded text-sm text-gray-300 border border-gray-700 truncate">
                                            <span className="text-gray-500 text-[10px] block uppercase">URL</span>
                                            {social.url}
                                        </div>
                                        <button onClick={() => removeSocial(idx)} className="text-red-400 hover:text-red-300 px-2 font-bold">✕</button>
                                    </div>
                                ))}

                                <div className="flex gap-2 mt-2">
                                    <select
                                        className="flex-1 bg-black/50 border border-gray-700 rounded p-2 text-xs text-white outline-none"
                                        value={newSocial.platform}
                                        onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Website">Website</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Username/Link"
                                        className="flex-1 bg-black/50 border border-gray-700 rounded p-2 text-xs text-white outline-none"
                                        value={newSocial.url}
                                        onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                                    />
                                    <button
                                        onClick={addSocial}
                                        type="button"
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-3 rounded font-bold text-lg disabled:opacity-50"
                                        disabled={!newSocial.platform || !newSocial.url}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mt-2">
                                <label className="block text-gray-400 text-xs mb-1 uppercase">Personal Note</label>
                                <textarea
                                    className="w-full h-24 bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none resize-none"
                                    value={formData.userNote}
                                    onChange={(e) => setFormData({ ...formData, userNote: e.target.value })}
                                    placeholder="Write a note..."
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
