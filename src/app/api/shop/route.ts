import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import ShopItem from '../../../models/ShopItem';

export async function GET() {
    try {
        await dbConnect();
        const items = await ShopItem.find({ isActive: true });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}