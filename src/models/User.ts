import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../types/db';

export interface IUserDocument extends Omit<IUser, '_id'>, Document { }

const InventoryItemSchema = new Schema(
    {
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopItem',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 0,
        },
    },
    { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'Password hash is required'],
        },
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: 'Couple',
            default: null,
        },
        goldCoins: {
            type: Number,
            default: 100,
            min: 0,
        },
        inventory: {
            type: [InventoryItemSchema],
            default: [],
        },
        fcmToken: {
            type: String,
            default: null,
        },
        lastLoginAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;