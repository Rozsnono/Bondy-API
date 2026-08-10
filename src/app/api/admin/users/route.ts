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
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
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
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
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

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await User.findById(id);
        if (user && user.coupleId) {
            const couple = await Couple.findById(user.coupleId);
            if (couple) {
                if (couple.partner1Id.toString() === id && !couple.partner2Id) {
                    await Couple.findByIdAndDelete(couple._id);
                } else {
                    if (couple.partner1Id.toString() === id) {
                        couple.partner1Id = couple!.partner2Id!;
                        couple.partner2Id = null as any;
                    } else {
                        couple.partner2Id = null as any;
                    }
                    await couple.save();
                }
            }
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}