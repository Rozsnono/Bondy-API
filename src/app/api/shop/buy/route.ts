import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
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
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const item = await ShopItem.findById(itemId);
        if (!item || !item.isActive) {
            return NextResponse.json({ error: 'Item is not available' }, { status: 404 });
        }

        if (user.goldCoins < item.price) {
            return NextResponse.json({ error: 'Insufficient gold coins' }, { status: 400 });
        }

        // Deduct coins
        user.goldCoins -= item.price;

        // Add item to User Inventory
        const existingIndex = user.inventory.findIndex(
            (inv) => inv.itemId.toString() === item._id.toString()
        );

        if (existingIndex >= 0) {
            user.inventory[existingIndex].quantity += 1;
        } else {
            user.inventory.push({ itemId: item._id, quantity: 1 });
        }

        await user.save();

        const populatedUser = await User.findById(userId).populate('inventory.itemId');

        return NextResponse.json({
            message: `Added ${item.name} to your Inventory!`,
            remainingGold: user.goldCoins,
            inventory: populatedUser?.inventory || [],
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}