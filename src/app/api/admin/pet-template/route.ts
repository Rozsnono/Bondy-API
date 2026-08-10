import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import PetTemplate from '../../../../models/PetTemplate';

export async function GET() {
    try {
        await dbConnect();
        const templates = await PetTemplate.find().sort({ createdAt: -1 });
        return NextResponse.json({ templates });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pet templates' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const template = await PetTemplate.create({
            name: data.name,
            category: data.category,
            description: data.description,
            lottieUrls: data.lottieUrls,
            baseHungerDecayRate: Number(data.baseHungerDecayRate) || 5,
            baseMoodDecayRate: Number(data.baseMoodDecayRate) || 5,
            baseCleanlinessDecayRate: Number(data.baseCleanlinessDecayRate) || 4,
            baseEnergyDecayRate: Number(data.baseEnergyDecayRate) || 3,
            isActive: data.isActive ?? true,
        });

        return NextResponse.json({ template });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create pet template' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id, ...data } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
        }

        const template = await PetTemplate.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ template });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update pet template' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
        }

        await PetTemplate.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Template deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete pet template' }, { status: 500 });
    }
}