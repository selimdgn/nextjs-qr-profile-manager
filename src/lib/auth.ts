import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'admin_session';
// In a real app, use environment variables for this
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
import db from './db';

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    // console.log('Checking auth cookie:', { name: ADMIN_COOKIE_NAME, value: session?.value });
    return session?.value === 'true';
}

export function verifyAdmin(username: string, password: string): boolean {
    // Fallback for environment variable (optional, maybe remove eventually)
    // if (username === 'admin' && password === ADMIN_PASSWORD) return true;

    try {
        const stmt = db.prepare('SELECT password FROM admins WHERE username = ?');
        const admin: any = stmt.get(username);

        if (admin && admin.password === password) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Verify admin error:', error);
        return false;
    }
}

export function verifyUser(phoneNumber: string, password: string): { id: string, name: string } | null {
    try {
        const stmt = db.prepare('SELECT id, name FROM users WHERE phoneNumber = ? AND password = ?');
        const user = stmt.get(phoneNumber, password) as { id: string, name: string } | undefined;
        return user || null;
    } catch (error) {
        console.error('Verify user error:', error);
        return null;
    }
}
