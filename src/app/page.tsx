'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (data.role === 'user' && data.id) {
                    router.push(`/${data.id}`);
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const qrCodeBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABEUlEQVR4nO2ZwQ7CMAxE2///6CV44IQiW9I2iZynIq3X2i8Oq83m/X6/1+v1/n+9Xq/3/5/3+433+433+433+42f9xvf7zfe7zfe7zfe7zc+32+832+832+832+83298vt94v994v994v994v9/4fL/xfr/xfr/xfr/xfr/x+X7j/X7j/X7j/X7j/X7j8/3G+/3G+/3G+/3G+/3G5/uN9/uN9/uN9/uN9/uNz/cb7/cb7/cb7/cb7/cbn+833u833u833u833u83Pt9vvN9vvN9vvN9vvN9vfL7feL/feL/feL/feL/f+Hy/8X6/8X6/8X6/8X6/8fl+4/1+4/1+4/1+4/1+4/P9xvv9xvv9xvv9xvv9xuf7jff7jff7jff7jff7jS/3G5/3G/8H7/cb7/cb7/cbH/sN93V9A/q488gAAAAASUVORK5CYII=";

    return (
        <div className="min-h-screen flex items-center justify-center">

            {/* Login Card */}
            <div className="w-full max-w-md px-6">
                <div className="glass-liquid glass-liquid-hover rounded-3xl p-8 transform transition-all duration-500">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter drop-shadow-lg">
                            kisibilgisi.com
                        </h1>
                        <p className="text-white/80 text-sm tracking-[0.2em] uppercase font-semibold">Kullanıcı Girişi</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-black/40 focus:border-[#24C1E8]/50 focus:ring-1 focus:ring-[#24C1E8]/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-black/40 focus:border-[#24C1E8]/50 focus:ring-1 focus:ring-[#24C1E8]/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/40 border border-red-500/30 rounded-lg text-red-200 text-sm text-center animate-shake backdrop-blur-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full glass-liquid text-white font-bold py-4 rounded-xl transform transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_40px_rgba(36,193,232,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Giriş Yapılıyor...</span>
                                </div>
                            ) : (
                                <span className="tracking-widest transition-all duration-300">GİRİŞ</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="h-px w-16 bg-[#24C1E8]/20 mx-auto mb-4"></div>
                        <p className="text-[10px] text-gray-500/80 uppercase tracking-widest">BİR RUBBLETALK KURULUŞUDUR</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
