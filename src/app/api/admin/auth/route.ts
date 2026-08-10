import { NextResponse } from 'next/server';
import { verifyAdminMasterPassword, generateAdminSessionToken, verifyAdminSessionToken } from '../../../../lib/adminAuth';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Master password is required' }, { status: 400 });
        }

        if (!verifyAdminMasterPassword(password)) {
            return NextResponse.json({ error: 'Invalid master password' }, { status: 401 });
        }

        const token = generateAdminSessionToken();

        const response = NextResponse.json({ success: true, token });
        response.cookies.set('bondy_admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/bondy_admin_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (token && verifyAdminSessionToken(token)) {
        return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('bondy_admin_session');
    return response;
}