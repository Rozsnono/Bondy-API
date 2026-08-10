import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Couple from '../../../../models/Couple';
import PetTemplate from '../../../../models/PetTemplate';
import Pet from '../../../../models/Pet';
import { getUserIdFromRequest } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { templateId, nickname } = await req.json();
        if (!templateId || !nickname) {
            return NextResponse.json({ error: 'Template ID and nickname are required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || !user.coupleId) {
            return NextResponse.json({ error: 'User must be part of a couple to adopt a pet' }, { status: 400 });
        }

        const couple = await Couple.findById(user.coupleId);
        if (!couple) {
            return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
        }

        if (couple.petId) {
            const existingPet = await Pet.findById(couple.petId);
            if (existingPet && !existingPet.isDead) {
                return NextResponse.json({ error: 'Couple already has an active pet' }, { status: 400 });
            }
        }

        const template = await PetTemplate.findById(templateId);
        if (!template) {
            return NextResponse.json({ error: 'Pet species template not found' }, { status: 404 });
        }

        // Egg-laying vs Mammal rule
        const isEggLaying = ['bird', 'reptile', 'amphibian'].includes(template.category);
        const initialStage = isEggLaying ? 'egg' : 'baby';

        const pet = await Pet.create({
            coupleId: couple._id,
            templateId: template._id,
            nickname,
            stage: initialStage,
            hatchProgress: isEggLaying ? 0 : 100,
            stats: {
                hunger: 100,
                mood: 100,
                cleanliness: 100,
                health: 100,
                energy: 100,
            },
            partner1LastInteractionAt: new Date(),
            partner2LastInteractionAt: new Date(),
            lastStatsUpdateAt: new Date(),
        });

        couple.petId = pet._id;
        await couple.save();

        return NextResponse.json({ pet, template });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}