import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import { getUserIdFromRequest } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { inviteCode } = await req.json();
        if (!inviteCode) {
            return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.coupleId) {
            return NextResponse.json({ error: 'You are already paired in a couple' }, { status: 400 });
        }

        const couple = await Couple.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!couple) {
            return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
        }

        if (couple.partner2Id) {
            return NextResponse.json({ error: 'This couple room is already full' }, { status: 400 });
        }

        if (couple.partner1Id.toString() === userId) {
            return NextResponse.json({ error: 'You cannot pair with yourself' }, { status: 400 });
        }

        couple.partner2Id = user._id;
        await couple.save();

        user.coupleId = couple._id;
        await user.save();

        return NextResponse.json({ message: 'Successfully joined couple!', couple });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}