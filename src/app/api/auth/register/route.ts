import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { hashPassword, generateToken } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        const passwordHash = hashPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            goldCoins: 100,
        });

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