import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import PetTemplate from '../../../models/PetTemplate';

export async function GET() {
    try {
        await dbConnect();
        const templates = await PetTemplate.find({ isActive: true });
        return NextResponse.json({ templates });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}