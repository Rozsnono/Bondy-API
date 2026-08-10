import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import Pet from '../../../models/Pet';
import PetTemplate from '../../../models/PetTemplate';
import { getUserIdFromRequest } from '../../../lib/auth';
import { processPetStatDecay } from '../../../lib/petLogic';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return NextResponse.json({ pet: null, coupleId: null, userGoldCoins: user?.goldCoins || 100 });
        }

        const pet = await Pet.findOne({ coupleId: user.coupleId });
        if (!pet) {
            return NextResponse.json({ pet: null, coupleId: user.coupleId, userGoldCoins: user.goldCoins });
        }

        const updatedPet = await processPetStatDecay(pet);
        const template = await PetTemplate.findById(updatedPet.templateId);

        return NextResponse.json({
            pet: updatedPet,
            template,
            coupleId: user.coupleId,
            userGoldCoins: user.goldCoins,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}