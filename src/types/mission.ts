export type MissionCategory = 'deportes' | 'slots' | 'predicciones' | 'social' | 'casino';

export type MissionStatus = 'pending' | 'completed' | 'claimed' | 'expired' | 'locked';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  group: 'daily' | 'weekly' | 'event' | 'locked';
  progress: number;
  target: number;
  ruleId?: string;
  rewardXP: number;
  rewardCoins?: number;
  expiresAt?: string;
  expiresIn?: string;
  status: MissionStatus;
  lockReason?: string;
}
