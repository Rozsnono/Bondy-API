import { Types } from 'mongoose';

export type PetCategory = 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'fantasy';

export type PetStage = 'egg' | 'baby' | 'teen' | 'adult';

export type ShopItemType = 'food' | 'clean' | 'medicine' | 'toy';

export interface IInventoryItem {
    itemId: Types.ObjectId;
    quantity: number;
}

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    coupleId?: Types.ObjectId | null;
    goldCoins: number;
    inventory: IInventoryItem[];
    fcmToken?: string | null;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICouple {
    _id: Types.ObjectId;
    partner1Id: Types.ObjectId;
    partner2Id?: Types.ObjectId | null;
    inviteCode: string;
    petId?: Types.ObjectId | null;
    streakDays: number;
    lastTogetherInteractionAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPetLottieUrls {
    eggUrl?: string;
    idleUrl: string;
    eatingUrl: string;
    bathingUrl: string;
    playingUrl: string;
    sleepingUrl: string;
    sickUrl: string;
    deadUrl: string;
    walkInUrl?: string;
}

export interface IPetTemplate {
    _id: Types.ObjectId;
    name: string;
    category: PetCategory;
    description: string;
    lottieUrls: IPetLottieUrls;
    baseHungerDecayRate: number;
    baseMoodDecayRate: number;
    baseCleanlinessDecayRate: number;
    baseEnergyDecayRate: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPetStats {
    hunger: number;
    mood: number;
    cleanliness: number;
    health: number;
    energy: number;
}

export interface IPet {
    _id: Types.ObjectId;
    coupleId: Types.ObjectId;
    templateId: Types.ObjectId;
    nickname: string;
    stage: PetStage;
    hatchProgress: number;
    stats: IPetStats;
    partner1LastInteractionAt: Date;
    partner2LastInteractionAt: Date;
    isSleeping: boolean;
    isDead: boolean;
    deathReason?: string | null;
    lastStatsUpdateAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStatEffect {
    hunger?: number;
    mood?: number;
    cleanliness?: number;
    health?: number;
    energy?: number;
}

export interface IShopItem {
    _id: Types.ObjectId;
    name: string;
    type: ShopItemType;
    description: string;
    price: number;
    iconName: string;
    iconSvg?: string;
    statEffects: IStatEffect;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}