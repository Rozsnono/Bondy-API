import mongoose, { Schema, Document, Model } from 'mongoose';
import { IShopItem } from '../types/db';

export interface IShopItemDocument extends Omit<IShopItem, '_id'>, Document { }

const StatEffectSchema = new Schema(
    {
        hunger: { type: Number, default: 0 },
        mood: { type: Number, default: 0 },
        cleanliness: { type: Number, default: 0 },
        health: { type: Number, default: 0 },
        energy: { type: Number, default: 0 },
    },
    { _id: false }
);

const ShopItemSchema = new Schema<IShopItemDocument>(
    {
        name: {
            type: String,
            required: [true, 'Shop item name is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['food', 'clean', 'medicine', 'toy'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        iconName: {
            type: String,
            required: true,
            default: 'ShoppingBag',
        },
        iconSvg: {
            type: String,
            default: null,
        },
        statEffects: {
            type: StatEffectSchema,
            default: () => ({}),
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

const ShopItem: Model<IShopItemDocument> =
    mongoose.models.ShopItem || mongoose.model<IShopItemDocument>('ShopItem', ShopItemSchema);

export default ShopItem;