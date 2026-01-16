import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Security Check: Verify user session OR admin session
        const cookieStore = await cookies();
        const userSession = cookieStore.get('user_session');
        const adminSession = cookieStore.get('admin_session');

        const isOwner = userSession?.value === id;
        const isAdmin = adminSession?.value === 'true';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, phoneNumber, bloodType, photoUrl, userNote, emergencyContacts, socialMedia } = body;

        // Ensure emergencyContacts is stored as a string
        const contactsString = typeof emergencyContacts === 'object' ? JSON.stringify(emergencyContacts) : emergencyContacts;
        const socialString = typeof socialMedia === 'object' ? JSON.stringify(socialMedia) : socialMedia;

        const update = db.prepare('UPDATE users SET name = ?, phoneNumber = ?, bloodType = ?, photoUrl = ?, userNote = ?, emergencyContacts = ?, socialMedia = ? WHERE id = ?');
        update.run(name, phoneNumber, bloodType, photoUrl, userNote, contactsString, socialString, id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
