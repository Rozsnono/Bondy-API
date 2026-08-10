import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { verifyPassword, generateToken } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = generateToken({ userId: user._id.toString(), email: user.email });

        return NextResponse.json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                coupleId: user.coupleId,
                goldCoins: user.goldCoins,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}