import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import ShopItem from '../../../models/ShopItem';
import User from '../../../models/User';
import { getUserIdFromRequest } from '../../../lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        let userGoldCoins = 100;

        if (userId) {
            const user = await User.findById(userId);
            if (user) userGoldCoins = user.goldCoins;
        }

        const items = await ShopItem.find({ isActive: true });
        return NextResponse.json({ items, userGoldCoins });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 });
    }
}