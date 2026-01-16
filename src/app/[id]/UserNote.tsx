'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserNoteProps {
    userId: string;
    initialNote: string;
}

export default function UserNote({ userId, initialNote }: UserNoteProps) {
    const [note, setNote] = useState(initialNote);
    const [isEditing, setIsEditing] = useState(false);
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [editNote, setEditNote] = useState(note);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`/api/users/${userId}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                setPin('');
            } else {
                setError('Incorrect PIN');
            }
        } catch (err) {
            setError('Auth failed');
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/users/${userId}/note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin, note: editNote }), // We need to store PIN in state or re-ask? 
                // Ah, wait. The API requires the PIN to update the note.
                // But I cleared the PIN state above for security.
                // I should probably Keep the PIN in memory if authenticated?
                // Or better: The Auth step just unlocks the UI. The Save step needs the PIN again?
                // Let's store the verified PIN in state for the session of editing.
            });

            // Re-think: verification is stateless on server.
            // So we need to send the PIN with the update request.
            // I should capture the PIN when authenticated and keep it until edit is done.
        } catch (err) {
            console.log(err);
        }
    };

    // Refined Auth Handler
    const handleAuthAndSavePin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`/api/users/${userId}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                // Keep PIN in state to use for update
            } else {
                setError('Incorrect PIN');
                setPin('');
            }
        } catch (err) {
            setError('Auth failed');
        }
    }

    const saveNote = async () => {
        try {
            const res = await fetch(`/api/users/${userId}/note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin, note: editNote }),
            });

            if (res.ok) {
                setNote(editNote);
                setIsEditing(false);
                setIsAuthenticated(false);
                setPin('');
                router.refresh();
            } else {
                alert('Failed to save note');
            }
        } catch (err) {
            alert('Error saving note');
        }
    }

    return (
        <div className="w-full">
            {/* Display Note */}
            <div className="bg-white/5 rounded-xl p-4 mb-4 text-left border border-white/5 relative group">
                {note ? (
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{note}</p>
                ) : (
                    <p className="text-gray-300 text-sm italic opacity-80">Araç kullanıcısı bir not bırakmadı.</p>
                )}

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                        ✎
                    </button>
                )}
            </div>

            {/* Edit Modal / Area */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        {!isAuthenticated ? (
                            <form onSubmit={handleAuthAndSavePin} className="space-y-4">
                                <h3 className="text-lg font-bold text-white text-center">Security Check</h3>
                                <p className="text-xs text-gray-400 text-center mb-4">Enter user PIN to edit.</p>

                                <input
                                    type="password"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-center tracking-[1em] font-mono focus:border-green-500 outline-none"
                                    maxLength={6}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="••••••"
                                    autoFocus
                                />

                                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setPin(''); setError(''); }}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-bold"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white text-center">Edit Note</h3>

                                <textarea
                                    className="w-full h-32 bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none resize-none"
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    placeholder="Write your note here..."
                                />

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => { setIsEditing(false); setIsAuthenticated(false); setPin(''); }}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveNote}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-bold"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
