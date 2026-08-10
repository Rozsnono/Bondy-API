import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import Pet from '../../../../models/Pet';
import PetTemplate from '../../../../models/PetTemplate';

export async function GET() {
    try {
        await dbConnect();
        const totalUsers = await User.countDocuments();
        const totalCouples = await Couple.countDocuments();
        const activePets = await Pet.countDocuments({ isDead: false });
        const totalSpecies = await PetTemplate.countDocuments();

        return NextResponse.json({
            totalUsers,
            totalCouples,
            activePets,
            totalSpecies,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
    }
}