import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, photoUrl, phoneNumber, password, bloodType, extraInfo, emergencyContacts, socialMedia } = body;

        const id = uuidv4();
        // PIN is deprecated, but we keep the column for legacy or fallback. We won't generate it anymore or just empty.
        // Let's keep it empty or null.

        const insert = db.prepare('INSERT INTO users (id, name, photoUrl, phoneNumber, password, bloodType, extraInfo, pin, userNote, emergencyContacts, socialMedia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        insert.run(id, name, photoUrl, phoneNumber, password, bloodType, JSON.stringify(extraInfo || {}), '', '', JSON.stringify(emergencyContacts || []), JSON.stringify(socialMedia || []));

        return NextResponse.json({ id, success: true });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
