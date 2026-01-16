import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kisibilgisi.com - Identity System',
    description: 'Secure QR Code Identity System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-black relative overflow-x-hidden text-white">
                {/* Global Background Gradients */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Fragmented Nebula Layout - More pieces, different sizes */}

                    {/* Large base movers */}
                    <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/30 rounded-full mix-blend-screen filter blur-[100px] animate-nebula-move delay-1"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px] animate-nebula-move delay-2"></div>

                    {/* Medium fragments */}
                    <div className="absolute top-[20%] right-[30%] w-[40vw] h-[40vw] bg-indigo-900/30 rounded-full mix-blend-screen filter blur-[80px] animate-nebula-move delay-3"></div>
                    <div className="absolute bottom-[20%] left-[20%] w-[45vw] h-[45vw] bg-sky-900/30 rounded-full mix-blend-screen filter blur-[90px] animate-nebula-move delay-1"></div>

                    {/* Small intense fragments */}
                    <div className="absolute top-[40%] left-[40%] w-[25vw] h-[25vw] bg-cyan-800/20 rounded-full mix-blend-screen filter blur-[60px] animate-nebula-move delay-2"></div>
                    <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] bg-blue-800/20 rounded-full mix-blend-screen filter blur-[70px] animate-nebula-move delay-3"></div>
                    <div className="absolute bottom-[10%] left-[10%] w-[20vw] h-[20vw] bg-teal-900/20 rounded-full mix-blend-screen filter blur-[50px] animate-nebula-move delay-1"></div>
                </div>

                <div className="relative z-10 w-full min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
