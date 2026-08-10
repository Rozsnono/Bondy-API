import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPetTemplate } from '../types/db';

export interface IPetTemplateDocument extends Omit<IPetTemplate, '_id'>, Document { }

const PetLottieUrlsSchema = new Schema(
    {
        eggUrl: { type: String, default: null },
        idleUrl: { type: String, required: true },
        eatingUrl: { type: String, required: true },
        bathingUrl: { type: String, required: true },
        playingUrl: { type: String, required: true },
        sleepingUrl: { type: String, required: true },
        sickUrl: { type: String, required: true },
        deadUrl: { type: String, required: true },
        walkInUrl: { type: String, default: null },
    },
    { _id: false }
);

const PetTemplateSchema = new Schema<IPetTemplateDocument>(
    {
        name: {
            type: String,
            required: [true, 'Pet species name is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['mammal', 'bird', 'reptile', 'amphibian', 'fantasy'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        lottieUrls: {
            type: PetLottieUrlsSchema,
            required: true,
        },
        baseHungerDecayRate: {
            type: Number,
            default: 5, // Points lost per hour
        },
        baseMoodDecayRate: {
            type: Number,
            default: 5,
        },
        baseCleanlinessDecayRate: {
            type: Number,
            default: 4,
        },
        baseEnergyDecayRate: {
            type: Number,
            default: 3,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const PetTemplate: Model<IPetTemplateDocument> =
    mongoose.models.PetTemplate ||
    mongoose.model<IPetTemplateDocument>('PetTemplate', PetTemplateSchema);

export default PetTemplate;