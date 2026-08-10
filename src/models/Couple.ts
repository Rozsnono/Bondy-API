import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICouple } from '../types/db';

export interface ICoupleDocument extends Omit<ICouple, '_id'>, Document { }

const CoupleSchema = new Schema<ICoupleDocument>(
    {
        partner1Id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        partner2Id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        inviteCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        petId: {
            type: Schema.Types.ObjectId,
            ref: 'Pet',
            default: null,
        },
        streakDays: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastTogetherInteractionAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Couple: Model<ICoupleDocument> =
    mongoose.models.Couple || mongoose.model<ICoupleDocument>('Couple', CoupleSchema);

export default Couple;