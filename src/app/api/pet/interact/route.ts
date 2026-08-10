import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import Pet from '../../../../models/Pet';
import { getUserIdFromRequest } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action } = await req.json(); // 'hatch_warm' | 'pet' | 'sleep' | 'wake'
        if (!action) {
            return NextResponse.json({ error: 'Action type is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return NextResponse.json({ error: 'User/Couple not found' }, { status: 404 });
        }

        const couple = await Couple.findById(user.coupleId);
        if (!couple || !couple.petId) {
            return NextResponse.json({ error: 'Pet not found for this couple' }, { status: 404 });
        }

        const pet = await Pet.findById(couple.petId);
        if (!pet || pet.isDead) {
            return NextResponse.json({ error: 'Pet is unavailable or deceased' }, { status: 400 });
        }

        // Update partner interaction timestamps
        const now = new Date();
        if (couple.partner1Id.toString() === userId) {
            pet.partner1LastInteractionAt = now;
        } else {
            pet.partner2LastInteractionAt = now;
        }

        // Egg Hatching Logic
        if (pet.stage === 'egg') {
            if (action === 'hatch_warm') {
                pet.hatchProgress = Math.min(100, pet.hatchProgress + 20);
                if (pet.hatchProgress >= 100) {
                    pet.stage = 'baby';
                }
            }
            await pet.save();
            return NextResponse.json({ pet, message: pet.stage === 'baby' ? 'The egg hatched!' : 'Warmed the egg!' });
        }

        // Active Interactions
        if (action === 'pet') {
            pet.stats.mood = Math.min(100, pet.stats.mood + 15);
            if (pet.stats.mood < 100) user.goldCoins += 2; // Earn gold for spending quality time
            await user.save();
        } else if (action === 'sleep') {
            pet.isSleeping = true;
        } else if (action === 'wake') {
            pet.isSleeping = false;
        }

        pet.lastStatsUpdateAt = now;
        await pet.save();

        return NextResponse.json({ pet, userGoldCoins: user.goldCoins });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}