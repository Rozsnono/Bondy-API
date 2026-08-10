import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';

function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function GET() {
    try {
        await dbConnect();
        const couples = await Couple.find()
            .populate('partner1Id partner2Id petId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ couples });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch couples' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { partner1Id, partner2Id } = await req.json();

        if (!partner1Id || !partner2Id) {
            return NextResponse.json({ error: 'Both Partner 1 and Partner 2 are required' }, { status: 400 });
        }

        if (partner1Id === partner2Id) {
            return NextResponse.json({ error: 'Cannot pair a user with themselves' }, { status: 400 });
        }

        const user1 = await User.findById(partner1Id);
        const user2 = await User.findById(partner2Id);

        if (!user1 || !user2) {
            return NextResponse.json({ error: 'One or both users not found' }, { status: 404 });
        }

        let inviteCode = generateRandomCode();
        let isUnique = false;
        while (!isUnique) {
            const existing = await Couple.findOne({ inviteCode });
            if (!existing) isUnique = true;
            else inviteCode = generateRandomCode();
        }

        // Clean up temporary empty single rooms if they exist
        if (user1.coupleId) {
            const c1 = await Couple.findById(user1.coupleId);
            if (c1 && !c1.partner2Id && !c1.petId) await Couple.findByIdAndDelete(c1._id);
        }
        if (user2.coupleId) {
            const c2 = await Couple.findById(user2.coupleId);
            if (c2 && !c2.partner2Id && !c2.petId) await Couple.findByIdAndDelete(c2._id);
        }

        const couple = await Couple.create({
            partner1Id: user1._id,
            partner2Id: user2._id,
            inviteCode,
        });

        user1.coupleId = couple._id;
        user2.coupleId = couple._id;
        await user1.save();
        await user2.save();

        return NextResponse.json({ couple });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to pair users into a couple' }, { status: 500 });
    }
}