import { Types } from 'mongoose';

export type PetCategory = 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'fantasy';

export type PetStage = 'egg' | 'baby' | 'teen' | 'adult';

export type ShopItemType = 'food' | 'clean' | 'medicine' | 'toy';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    coupleId?: Types.ObjectId | null;
    goldCoins: number;
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
    eggUrl?: string; // Required for egg-laying categories
    idleUrl: string; // Default resting state
    eatingUrl: string;
    bathingUrl: string;
    playingUrl: string;
    sleepingUrl: string;
    sickUrl: string;
    deadUrl: string;
    walkInUrl?: string; // Entrance animation for mammals
}

export interface IPetTemplate {
    _id: Types.ObjectId;
    name: string;
    category: PetCategory;
    description: string;
    lottieUrls: IPetLottieUrls;
    baseHungerDecayRate: number; // Stat decay rate per hour
    baseMoodDecayRate: number;
    baseCleanlinessDecayRate: number;
    baseEnergyDecayRate: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPetStats {
    hunger: number; // 0 - 100
    mood: number; // 0 - 100
    cleanliness: number; // 0 - 100
    health: number; // 0 - 100
    energy: number; // 0 - 100
}

export interface IPet {
    _id: Types.ObjectId;
    coupleId: Types.ObjectId;
    templateId: Types.ObjectId;
    nickname: string;
    stage: PetStage;
    hatchProgress: number; // 0 - 100 (for egg stage)
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
    iconName: string; // Lucide fallback icon identifier
    iconSvg?: string; // Raw SVG markup string or SVG URL
    statEffects: IStatEffect;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}