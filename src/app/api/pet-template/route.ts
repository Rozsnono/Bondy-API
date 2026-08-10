import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongodb';
import PetTemplate from '../../../models/PetTemplate';

export async function GET() {
    try {
        await dbConnect();
        let templates = await PetTemplate.find({ isActive: true });

        // If fresh database with 0 templates, auto-seed default Shiba & Baby Dragon
        if (templates.length === 0) {
            await PetTemplate.create([
                {
                    name: 'Shiba Inu',
                    category: 'mammal',
                    description: 'A loyal and playful digital companion.',
                    lottieUrls: {
                        idleUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        eatingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        bathingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        playingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        sleepingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        sickUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        deadUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                    },
                    baseHungerDecayRate: 5,
                    baseMoodDecayRate: 5,
                    baseCleanlinessDecayRate: 4,
                    baseEnergyDecayRate: 3,
                    isActive: true,
                },
                {
                    name: 'Baby Dragon',
                    category: 'reptile',
                    description: 'Hatches from a warm magical egg.',
                    lottieUrls: {
                        eggUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        idleUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        eatingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        bathingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        playingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        sleepingUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        sickUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                        deadUrl: 'https://assets5.lottiefiles.com/packages/lf20_syq2yx5w.json',
                    },
                    baseHungerDecayRate: 5,
                    baseMoodDecayRate: 5,
                    baseCleanlinessDecayRate: 4,
                    baseEnergyDecayRate: 3,
                    isActive: true,
                },
            ]);
            templates = await PetTemplate.find({ isActive: true });
        }

        return NextResponse.json({ templates });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}