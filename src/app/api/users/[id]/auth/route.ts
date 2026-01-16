import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { pin } = await req.json();

        // Get user pin
        const user = db.prepare('SELECT pin FROM users WHERE id = ?').get(id) as { pin: string } | undefined;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.pin === pin) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
