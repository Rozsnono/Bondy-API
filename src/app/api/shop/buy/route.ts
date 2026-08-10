import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import Pet from '../../../../models/Pet';
import ShopItem from '../../../../models/ShopItem';
import { getUserIdFromRequest } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { itemId } = await req.json();
        if (!itemId) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return NextResponse.json({ error: 'User/Couple not found' }, { status: 404 });
        }

        const item = await ShopItem.findById(itemId);
        if (!item || !item.isActive) {
            return NextResponse.json({ error: 'Item is not available' }, { status: 404 });
        }

        if (user.goldCoins < item.price) {
            return NextResponse.json({ error: 'Insufficient gold coins' }, { status: 400 });
        }

        const couple = await Couple.findById(user.coupleId);
        if (!couple || !couple.petId) {
            return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
        }

        const pet = await Pet.findById(couple.petId);
        if (!pet || pet.isDead) {
            return NextResponse.json({ error: 'Pet is unavailable or deceased' }, { status: 400 });
        }

        // Deduct coins
        user.goldCoins -= item.price;
        await user.save();

        // Apply stat effects
        if (item.statEffects.hunger) {
            pet.stats.hunger = Math.min(100, pet.stats.hunger + item.statEffects.hunger);
        }
        if (item.statEffects.mood) {
            pet.stats.mood = Math.min(100, pet.stats.mood + item.statEffects.mood);
        }
        if (item.statEffects.cleanliness) {
            pet.stats.cleanliness = Math.min(100, pet.stats.cleanliness + item.statEffects.cleanliness);
        }
        if (item.statEffects.health) {
            pet.stats.health = Math.min(100, pet.stats.health + item.statEffects.health);
        }
        if (item.statEffects.energy) {
            pet.stats.energy = Math.min(100, pet.stats.energy + item.statEffects.energy);
        }

        const now = new Date();
        if (couple.partner1Id.toString() === userId) {
            pet.partner1LastInteractionAt = now;
        } else {
            pet.partner2LastInteractionAt = now;
        }
        pet.lastStatsUpdateAt = now;

        await pet.save();

        return NextResponse.json({
            message: `Successfully purchased and used ${item.name}!`,
            remainingGold: user.goldCoins,
            pet,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}