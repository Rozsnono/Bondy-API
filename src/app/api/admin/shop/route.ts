import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import ShopItem from '../../../../models/ShopItem';

export async function GET() {
    try {
        await dbConnect();
        const items = await ShopItem.find().sort({ createdAt: -1 });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const item = await ShopItem.create({
            name: data.name,
            type: data.type,
            description: data.description,
            price: Number(data.price),
            iconName: data.iconName || 'ShoppingBag',
            iconSvg: data.iconSvg || null,
            statEffects: {
                hunger: Number(data.statEffects?.hunger) || 0,
                mood: Number(data.statEffects?.mood) || 0,
                cleanliness: Number(data.statEffects?.cleanliness) || 0,
                health: Number(data.statEffects?.health) || 0,
                energy: Number(data.statEffects?.energy) || 0,
            },
            isActive: data.isActive ?? true,
        });

        return NextResponse.json({ item });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create shop item' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id, ...data } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const item = await ShopItem.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ item });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update shop item' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        await ShopItem.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Shop item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete shop item' }, { status: 500 });
    }
}