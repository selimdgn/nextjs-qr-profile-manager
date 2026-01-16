import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        console.log('Login attempt:', { username, password }); // CAUTION: Logs password
        if (verifyAdmin(username, password)) {
            const response = NextResponse.json({ success: true, role: 'admin' });
            response.cookies.set(ADMIN_COOKIE_NAME, 'true', {
                httpOnly: true,
                secure: false, // process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
            });
            return response;
        }

        // Check User Second (treat 'username' input as phoneNumber)
        // Dynamic import to avoid circular dependency if any (though auth.ts is safe)
        const { verifyUser } = await import('@/lib/auth');
        const user = verifyUser(username, password);

        if (user) {
            const response = NextResponse.json({ success: true, role: 'user', id: user.id });
            response.cookies.set('user_session', user.id, {
                httpOnly: true,
                secure: false, // process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            return response;
        }

        console.log('Login failed for:', username);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
