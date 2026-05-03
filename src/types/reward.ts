export type RewardKind = 'xp' | 'coins' | 'bonus' | 'freeSpin' | 'mysteryBox' | 'scratchCard' | 'physical';

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
  stockLabel: string;
  minVipTier?: string;
  disabledReason?: string;
}
