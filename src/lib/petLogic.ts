import Pet, { IPetDocument } from '../models/Pet';
import PetTemplate, { IPetTemplateDocument } from '../models/PetTemplate';

export async function processPetStatDecay(pet: IPetDocument): Promise<IPetDocument> {
    if (pet.isDead) return pet;

    const now = new Date();
    const hoursPassed = (now.getTime() - new Date(pet.lastStatsUpdateAt).getTime()) / (1000 * 60 * 60);

    if (hoursPassed < 0.01) {
        return pet; // Minimal time passed, skip
    }

    const template = (await PetTemplate.findById(pet.templateId)) as IPetTemplateDocument | null;
    if (!template) return pet;

    // Couple Mechanic Penalty: If one partner hasn't interacted for >24h, stat decay doubles
    const p1DiffHours = (now.getTime() - new Date(pet.partner1LastInteractionAt).getTime()) / (1000 * 60 * 60);
    const p2DiffHours = (now.getTime() - new Date(pet.partner2LastInteractionAt).getTime()) / (1000 * 60 * 60);
    const isNeglected = p1DiffHours > 24 || p2DiffHours > 24;
    const decayMultiplier = isNeglected ? 2.0 : 1.0;

    let newHunger = Math.max(0, pet.stats.hunger - template.baseHungerDecayRate * hoursPassed * decayMultiplier);
    let newMood = Math.max(0, pet.stats.mood - template.baseMoodDecayRate * hoursPassed * decayMultiplier);
    let newCleanliness = Math.max(0, pet.stats.cleanliness - template.baseCleanlinessDecayRate * hoursPassed * decayMultiplier);
    let newEnergy = pet.isSleeping
        ? Math.min(100, pet.stats.energy + 15 * hoursPassed)
        : Math.max(0, pet.stats.energy - template.baseEnergyDecayRate * hoursPassed * decayMultiplier);

    let newHealth = pet.stats.health;

    // Health drops rapidly if core stats hit zero
    if (newHunger === 0 || newMood === 0 || newCleanliness === 0) {
        const healthDecay = 10 * hoursPassed * decayMultiplier;
        newHealth = Math.max(0, newHealth - healthDecay);
    } else if (newHunger > 50 && newMood > 50 && newCleanliness > 50 && newHealth < 100) {
        // Health slowly recovers if stats are good
        newHealth = Math.min(100, newHealth + 2 * hoursPassed);
    }

    pet.stats = {
        hunger: Math.round(newHunger),
        mood: Math.round(newMood),
        cleanliness: Math.round(newCleanliness),
        health: Math.round(newHealth),
        energy: Math.round(newEnergy),
    };

    pet.lastStatsUpdateAt = now;

    if (pet.stats.health <= 0) {
        pet.isDead = true;
        pet.deathReason = isNeglected
            ? 'Died due to severe neglect from partner imbalance.'
            : 'Died due to low health and lack of care.';
    }

    await pet.save();
    return pet;
}