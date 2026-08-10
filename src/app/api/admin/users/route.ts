import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import Pet from '../../../../models/Pet';

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