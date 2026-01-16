'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
    id: string;
    name: string;
    photoUrl: string;
    bloodType: string;
    phoneNumber?: string;
    password?: string;
};

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => {
                if (res.status === 401) {
                    window.location.href = '/';
                    return [];
                }
                return res.json();
            })
            .then((data) => setUsers(data));
    }, []);

    const deleteUser = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setUsers(users.filter((u) => u.id !== id));
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Error deleting user');
        }
    };

    return (
        <div className="min-h-screen text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Customer Dashboard</h1>
                    <Link
                        href="/admin/dashboard/add"
                        className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
                    >
                        + Add Customer
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user.id} className="relative bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
                            <button
                                onClick={() => deleteUser(user.id, user.name)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete User"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <img
                                src={user.photoUrl || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlDQTNBRiIgY2xhc3M9IndyNiBoLTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNSA2YTQuNSA0LjUgMCAxMTkgMCA0LjUgNC41IDAgMDEtOSAwek0zLjc1MSAyMC4xMDVhOC4yNSA4LjI1IDAgMDExNi40OTggMCAuNzUuNzUgMCAwMS0uNDM3LjY5NUExOC42ODMgMTguNjgzIDAgMDExMiAyMi41Yy0yLjc4NiAwLTUuNDMzLS42MDgtNy44MTItMS43YS43NS43NSAwIDAxLS40MzctLjY5NXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4='}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-400">Blood Type: {user.bloodType}</p>
                                <p className="text-gray-400 text-sm">Phone: {user.phoneNumber || 'N/A'}</p>
                                <p className="text-sm font-mono text-yellow-400 mt-1">Pass: {user.password || 'N/A'}</p>
                                <div className="mt-2">
                                    <Link href={`/${user.id}`} className="text-blue-400 hover:underline text-sm" target="_blank">View Profile</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
