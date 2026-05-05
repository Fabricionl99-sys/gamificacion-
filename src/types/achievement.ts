export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type AchievementStatus = 'unlocked' | 'in_progress' | 'locked' | 'secret';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  status: AchievementStatus;
  icon: string;
  reward: { xp: number; coins?: number; chest_id?: string };
  progress?: { current: number; total: number };
  unlocked_at?: string;
  hint?: string;
}
