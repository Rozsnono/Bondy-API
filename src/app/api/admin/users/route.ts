import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import { hashPassword } from '../../../../lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        const couples = await Couple.find().populate('partner1Id partner2Id petId');

        return NextResponse.json({ users, couples });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users and couples' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password, goldCoins } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email address already exists' }, { status: 400 });
        }

        const passwordHash = hashPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            goldCoins: Number(goldCoins) || 100,
        });

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}