import type { GameCategory } from './category';

export type MissionCategory = GameCategory | 'predicciones' | 'social';

export type MissionStatus = 'pending' | 'completed' | 'claimed' | 'expired' | 'locked';

export interface MissionRequirement {
  id: string;
  label: string;
  currentValue: number;
  targetValue: number;
  isComplete: boolean;
  showProgress: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  group: 'daily' | 'weekly' | 'event' | 'locked';
  progress: number;
  target: number;
  requirements: MissionRequirement[];
  ruleId?: string;
  rewardXP: number;
  rewardCoins?: number;
  expiresAt?: string;
  expiresIn?: string;
  status: MissionStatus;
  lockReason?: string;
  claimedAt?: string | null;
}
