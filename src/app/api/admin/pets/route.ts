import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import Pet from '../../../../models/Pet';
import Couple from '../../../../models/Couple';

export async function GET() {
    try {
        await dbConnect();
        const pets = await Pet.find()
            .populate('templateId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ pets });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Pet ID is required' }, { status: 400 });
        }

        const pet = await Pet.findById(id);
        if (pet) {
            await Couple.findByIdAndUpdate(pet.coupleId, { petId: null });
            await Pet.findByIdAndDelete(id);
        }

        return NextResponse.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete pet' }, { status: 500 });
    }
}