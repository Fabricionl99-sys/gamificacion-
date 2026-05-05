export type RewardKind = 'xp' | 'coins' | 'bonus' | 'freeSpin' | 'mysteryBox' | 'scratchCard' | 'physical';
import type { VipTier } from './player';

export interface Reward {
  id: string;
  kind: RewardKind;
  label: string;
  value: number;
  expiresAt?: string;
}

export type ShopCategory = 'operatorBonus' | 'gamification' | 'physical';

export type ShopIcon = 'box' | 'sparkles' | 'zap' | 'shirt';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  cost: number;
  icon: ShopIcon;
  featured?: boolean;
  stock: number | null;
  lowStockThreshold: number;
  vipRequired: Exclude<VipTier, 'none'> | null;
  endsAt: string | null;
  disabledReason?: string;
}
