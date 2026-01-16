import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

type User = {
    id: string;
    name: string;
    photoUrl: string;
    bloodType: string;
    extraInfo: string | any;
};

export async function GET(
    req: NextRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse extraInfo if it's stored as JSON string
    if (user && typeof user.extraInfo === 'string') {
        try {
            user.extraInfo = JSON.parse(user.extraInfo);
        } catch {
            user.extraInfo = {};
        }
    }

    return NextResponse.json(user);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Security Check: Verify admin session
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (adminSession?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const del = db.prepare('DELETE FROM users WHERE id = ?');
        const result = del.run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
