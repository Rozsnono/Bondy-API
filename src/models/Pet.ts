import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPet } from '../types/db';

export interface IPetDocument extends Omit<IPet, '_id'>, Document { }

const PetStatsSchema = new Schema(
    {
        hunger: { type: Number, default: 100, min: 0, max: 100 },
        mood: { type: Number, default: 100, min: 0, max: 100 },
        cleanliness: { type: Number, default: 100, min: 0, max: 100 },
        health: { type: Number, default: 100, min: 0, max: 100 },
        energy: { type: Number, default: 100, min: 0, max: 100 },
    },
    { _id: false }
);

const PetSchema = new Schema<IPetDocument>(
    {
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: 'Couple',
            required: true,
            unique: true,
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: 'PetTemplate',
            required: true,
        },
        nickname: {
            type: String,
            required: true,
            trim: true,
        },
        stage: {
            type: String,
            enum: ['egg', 'baby', 'teen', 'adult'],
            default: 'baby',
        },
        hatchProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        stats: {
            type: PetStatsSchema,
            default: () => ({}),
        },
        partner1LastInteractionAt: {
            type: Date,
            default: Date.now,
        },
        partner2LastInteractionAt: {
            type: Date,
            default: Date.now,
        },
        isSleeping: {
            type: Boolean,
            default: false,
        },
        isDead: {
            type: Boolean,
            default: false,
        },
        deathReason: {
            type: String,
            default: null,
        },
        lastStatsUpdateAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Pet: Model<IPetDocument> =
    mongoose.models.Pet || mongoose.model<IPetDocument>('Pet', PetSchema);

export default Pet;