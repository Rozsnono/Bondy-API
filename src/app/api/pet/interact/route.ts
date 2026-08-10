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

        const { action, itemId } = await req.json();

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

        const now = new Date();
        if (couple.partner1Id.toString() === userId) {
            pet.partner1LastInteractionAt = now;
        } else {
            pet.partner2LastInteractionAt = now;
        }

        // Feeding an item from inventory
        if (action === 'feed' && itemId) {
            const invIndex = user.inventory.findIndex(
                (inv) => inv.itemId.toString() === itemId.toString()
            );

            if (invIndex < 0 || user.inventory[invIndex].quantity <= 0) {
                return NextResponse.json({ error: 'Item not found in inventory' }, { status: 400 });
            }

            const item = await ShopItem.findById(itemId);
            if (item && item.statEffects) {
                if (item.statEffects.hunger) pet.stats.hunger = Math.min(100, pet.stats.hunger + item.statEffects.hunger);
                if (item.statEffects.mood) pet.stats.mood = Math.min(100, pet.stats.mood + item.statEffects.mood);
                if (item.statEffects.cleanliness) pet.stats.cleanliness = Math.min(100, pet.stats.cleanliness + item.statEffects.cleanliness);
                if (item.statEffects.health) pet.stats.health = Math.min(100, pet.stats.health + item.statEffects.health);
                if (item.statEffects.energy) pet.stats.energy = Math.min(100, pet.stats.energy + item.statEffects.energy);
            }

            // Decrement inventory
            user.inventory[invIndex].quantity -= 1;
            if (user.inventory[invIndex].quantity <= 0) {
                user.inventory.splice(invIndex, 1);
            }
            await user.save();
        } else if (action === 'hatch_warm' && pet.stage === 'egg') {
            pet.hatchProgress = Math.min(100, pet.hatchProgress + 20);
            if (pet.hatchProgress >= 100) pet.stage = 'baby';
        } else if (action === 'pet') {
            pet.stats.mood = Math.min(100, pet.stats.mood + 15);
            if (pet.stats.mood < 100) {
                user.goldCoins += 2;
            }
            await user.save();
        } else if (action === 'sleep') {
            pet.isSleeping = true;
        } else if (action === 'wake') {
            pet.isSleeping = false;
        }

        pet.lastStatsUpdateAt = now;
        await pet.save();

        const populatedUser = await User.findById(userId).populate('inventory.itemId');

        return NextResponse.json({
            pet,
            userGoldCoins: user.goldCoins,
            inventory: populatedUser?.inventory || [],
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}