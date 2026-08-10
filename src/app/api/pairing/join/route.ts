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

        const targetCouple = await Couple.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!targetCouple) {
            return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
        }

        if (targetCouple.partner2Id) {
            return NextResponse.json({ error: 'This couple room is already full' }, { status: 400 });
        }

        if (targetCouple.partner1Id.toString() === userId) {
            return NextResponse.json({ error: 'You cannot pair with yourself' }, { status: 400 });
        }

        // FIX: If the user has an auto-generated empty couple room (no partner2, no pet), delete it first!
        if (user.coupleId && user.coupleId.toString() !== targetCouple._id.toString()) {
            const userExistingCouple = await Couple.findById(user.coupleId);
            if (
                userExistingCouple &&
                userExistingCouple.partner1Id.toString() === userId &&
                !userExistingCouple.partner2Id &&
                !userExistingCouple.petId
            ) {
                await Couple.findByIdAndDelete(userExistingCouple._id);
                user.coupleId = null;
            } else if (userExistingCouple && userExistingCouple.partner2Id) {
                return NextResponse.json({ error: 'You are already in an active couple room' }, { status: 400 });
            }
        }

        targetCouple.partner2Id = user._id;
        await targetCouple.save();

        user.coupleId = targetCouple._id;
        await user.save();

        return NextResponse.json({ message: 'Successfully joined couple!', couple: targetCouple });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}