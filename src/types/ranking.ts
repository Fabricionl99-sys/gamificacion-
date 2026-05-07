import type { VipTier } from './player';

export type RankingId =
  | 'best_xp'
  | 'best_casino'
  | 'best_live_casino'
  | 'best_sports'
  | 'best_virtuals'
  | 'best_poker'
  | 'best_depositors'
  | 'best_vip';

export interface RankingTopEntry {
  handle: string;
  metric_value: number;
  verified: boolean;
  vip_tier?: VipTier;
  /** Insignia del nivel del jugador (curva BO / tenant). */
  level_badge_url?: string;
}

export interface PlayerRankingSummary {
  ranking_id: RankingId;
  ranking_name: string;
  ranking_icon: string;
  active: boolean;
  display_order: number;
  player_position: number;
  player_metric_value: number;
  player_change: number;
  player_potential_prize: number;
  total_participants: number;
  closes_at: string;
  window: 'daily' | 'weekly' | 'monthly' | 'all_time';
  metric_label: string;
  top_5: RankingTopEntry[];
}

export interface LeaderboardEntry extends RankingTopEntry {
  position: number;
  prize_amount?: number;
  is_self?: boolean;
  level_badge_url?: string;
}

export interface LeaderboardFull {
  ranking_id: RankingId;
  entries: LeaderboardEntry[];
  player_position?: number;
  closes_at: string;
}
