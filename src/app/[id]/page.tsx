import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import db from '@/lib/db';

import ProfileEditor from './ProfileEditor';

type User = {
    id: string;
    name: string;
    photoUrl: string;
    phoneNumber?: string;
    bloodType: string;
    extraInfo: string;
    userNote?: string;
    emergencyContacts?: string; // JSON string in DB
    socialMedia?: string; // JSON string in DB
};

type EmergencyContact = {
    name: string; // Relationship/Name
    phone: string;
};

type SocialMedia = {
    platform: string;
    url: string;
};

// Directly fetch data in the server component
async function getUser(id: string): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;

    if (user && typeof user.extraInfo === 'string') {
        try {
            const parsed = JSON.parse(user.extraInfo);
            user.extraInfo = parsed.note || '';
        } catch {
            user.extraInfo = '';
        }
    }

    // Parse emergency contacts if they exist
    if (user && user.emergencyContacts) {
        try {
            // It might be already an object if the driver auto-parsed it (unlikely for better-sqlite3 TEXT) 
            // but let's be safe.
            // keeping it as string for the component to parse or parsing it here?
            // Let's parse it here to pass a clean object to the client component if needed, 
            // but the User type says string. Let's keep it consistent or extend the type.
            // Actually, let's just leave it as string in the User type and parse it in the component or below.
            // For now, let's just return it as is, and parse it in the render.
        } catch {
            // ignore
        }
    }

    return user || null;
}

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    // Check ownership
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');
    const adminSession = cookieStore.get('admin_session');

    // Allow edit if it's the user OR if it's an admin
    const isOwner = userSession?.value === id || adminSession?.value === 'true';

    return (
        <div className="flex items-center justify-center p-4 min-h-screen">
            {/* Background handled in layout.tsx */}

            <main className="relative z-10 w-full max-w-md glass-ocean rounded-3xl p-8 text-center text-white">

                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
                    <img
                        src={user.photoUrl || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlDQTNBRiIgY2xhc3M9IndyNiBoLTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNSA2YTQuNSA0LjUgMCAxMTkgMCA0LjUgNC41IDAgMDEtOSAwek0zLjc1MSAyMC4xMDVhOC4yNSA4LjI1IDAgMDExNi40OTggMCAuNzUuNzUgMCAwMS0uNDM3LjY5NUExOC42ODMgMTguNjgzIDAgMDExMiAyMi41Yy0yLjc4NiAwLTUuNDMzLS42MDgtNy44MTItMS43YS43NS43NSAwIDAxLS40MzctLjY5NXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4='}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white/10"
                    />
                </div>

                <h1 className="text-3xl font-bold mb-2 tracking-tight">{user.name}</h1>

                <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-red-500 font-medium">Kan Grubu:</span>
                    <span className="font-semibold text-lg">{user.bloodType}</span>
                </div>

                {user.phoneNumber && (
                    <div className="mb-6">
                        <a href={`tel:${user.phoneNumber}`} className="inline-flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 transition px-4 py-2 rounded-xl border border-blue-500/30">
                            <span className="text-blue-300 text-sm">İletişim için tıklayın:</span>
                            <span className="text-white font-medium">{user.phoneNumber}</span>
                        </a>
                    </div>
                )}

                {/* Emergency Contacts Display */}
                {user.emergencyContacts && (() => {
                    try {
                        const contacts: EmergencyContact[] = JSON.parse(user.emergencyContacts);
                        if (contacts.length > 0) {
                            return (
                                <div className="mb-6 space-y-3">
                                    <h3 className="text-green-500 text-sm uppercase tracking-widest font-bold mb-2">Alternatif İletişim</h3>
                                    {contacts.map((contact, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-xl border border-white/5">
                                            <span className="text-gray-300 text-sm font-medium">{contact.name}</span>
                                            <a href={`tel:${contact.phone}`} className="text-green-400 font-bold text-sm bg-green-400/10 px-2 py-1 rounded hover:bg-green-400/20 transition">
                                                {contact.phone}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    } catch (e) { return null; }
                })()}

                {/* Social Media Display */}
                {user.socialMedia && (() => {
                    try {
                        const socials: SocialMedia[] = JSON.parse(user.socialMedia);
                        if (socials.length > 0) {
                            return (
                                <div className="mb-6 space-y-3">
                                    <h3 className="text-purple-400 text-sm uppercase tracking-widest font-bold mb-2">Sosyal Medya</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {socials.map((social, idx) => (
                                            <a key={idx} href={social.url.startsWith('http') ? social.url : `https://${social.url}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 px-2 py-3 rounded-xl border border-white/5 transition group">
                                                <span className="text-gray-400 text-xs uppercase mb-1">{social.platform}</span>
                                                <span className="text-white text-xs font-semibold truncate w-full text-center group-hover:text-purple-300 transition">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                    } catch (e) { return null; }
                })()}

                {/* Profile Editor (Note + Edit Mode) */}
                <ProfileEditor user={user} isOwner={isOwner} />

                {user.extraInfo && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left backdrop-blur-sm shadow-inner">
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{user.extraInfo}</p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Bir RubbleTalk kuruluşudur</p>
                    <p className="text-sm font-semibold mt-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">kisibilgisi.com</p>
                </div>
            </main>
        </div>
    );
}
