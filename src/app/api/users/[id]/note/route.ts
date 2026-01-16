import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { pin, note } = await req.json();

        // Verify PIN first
        const user = db.prepare('SELECT pin FROM users WHERE id = ?').get(id) as { pin: string } | undefined;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.pin !== pin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update note
        const update = db.prepare('UPDATE users SET userNote = ? WHERE id = ?');
        update.run(note, id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
