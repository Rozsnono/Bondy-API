import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import { getUserIdFromRequest } from '../../../../lib/auth';

function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.coupleId) {
            const existingCouple = await Couple.findById(user.coupleId);
            if (existingCouple) {
                return NextResponse.json({ inviteCode: existingCouple.inviteCode, couple: existingCouple });
            }
        }

        let code = generateRandomCode();
        let isUnique = false;

        while (!isUnique) {
            const existing = await Couple.findOne({ inviteCode: code });
            if (!existing) {
                isUnique = true;
            } else {
                code = generateRandomCode();
            }
        }

        const couple = await Couple.create({
            partner1Id: user._id,
            inviteCode: code,
        });

        user.coupleId = couple._id;
        await user.save();

        return NextResponse.json({ inviteCode: code, couple });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}