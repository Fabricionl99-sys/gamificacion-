import type { LeaderboardFull, PlayerRankingSummary, RankingTopEntry } from '../types/ranking';
import { getJson } from './fetchJson';

interface BackendRankingRow {
  code: string;
  name: string;
  description?: string;
  image_url?: string | null;
  metric_type?: string;
  period_type?: 'daily' | 'weekly' | 'monthly' | 'all_time' | string;
  current_period_start?: string | null;
  current_period_end?: string | null;
  next_period_resets_at?: string | null;
  max_visible_positions?: number;
}

interface BackendLeaderboardEntry {
  position: number;
  player_handle?: string;
  handle?: string;
  metric_value: number;
  verified?: boolean;
  vip_tier?: string;
  level_badge_url?: string;
  is_self?: boolean;
}

interface BackendLeaderboard {
  ranking_code?: string;
  metric_type?: string;
  period_start?: string | null;
  period_end?: string | null;
  participants_count?: number;
  entries?: BackendLeaderboardEntry[];
  my_position?: number | null;
}

const PERIOD_ICONS: Record<string, string> = {
  all_time: '🏆',
  weekly: '📅',
  monthly: '🗓️',
  daily: '⚡',
};

function mapWindow(period?: string): PlayerRankingSummary['window'] {
  if (period === 'daily' || period === 'weekly' || period === 'monthly' || period === 'all_time') return period;
  return 'weekly';
}

function adaptTopEntry(entry: BackendLeaderboardEntry): RankingTopEntry {
  return {
    handle: entry.player_handle ?? entry.handle ?? '—',
    metric_value: entry.metric_value,
    verified: Boolean(entry.verified),
    vip_tier: entry.vip_tier as RankingTopEntry['vip_tier'],
    level_badge_url: entry.level_badge_url,
  };
}

function adaptRankingRow(raw: BackendRankingRow, index: number): PlayerRankingSummary {
  return {
    ranking_id: raw.code,
    ranking_name: raw.name,
    ranking_icon: PERIOD_ICONS[raw.period_type ?? ''] ?? '🏅',
    active: true,
    display_order: index,
    player_position: 0,
    player_metric_value: 0,
    player_change: 0,
    player_potential_prize: 0,
    total_participants: 0,
    closes_at: raw.current_period_end ?? raw.next_period_resets_at ?? new Date().toISOString(),
    window: mapWindow(raw.period_type),
    metric_label: raw.metric_type ?? 'XP',
    top_5: [],
  };
}

function adaptLeaderboard(raw: BackendLeaderboard, rankingCode: string): LeaderboardFull {
  const entries = (raw.entries ?? []).map((entry) => ({
    ...adaptTopEntry(entry),
    position: entry.position,
    is_self: entry.is_self,
  }));
  return {
    ranking_id: raw.ranking_code ?? rankingCode,
    entries,
    player_position: raw.my_position ?? undefined,
    closes_at: raw.period_end ?? new Date().toISOString(),
  };
}

export async function getPlayerRankings(): Promise<PlayerRankingSummary[]> {
  const rows = await getJson<BackendRankingRow[]>('/v1/player/rankings');
  const rankings = rows.map(adaptRankingRow);

  const enriched = await Promise.all(
    rankings.map(async (ranking) => {
      try {
        const lb = await getJson<BackendLeaderboard>(`/v1/player/rankings/${ranking.ranking_id}/leaderboard`, {
          params: { limit: 5 },
        });
        return {
          ...ranking,
          player_position: lb.my_position ?? 0,
          total_participants: lb.participants_count ?? lb.entries?.length ?? 0,
          top_5: (lb.entries ?? []).slice(0, 5).map(adaptTopEntry),
          closes_at: lb.period_end ?? ranking.closes_at,
        };
      } catch {
        return ranking;
      }
    }),
  );

  return enriched;
}

export const getRankings = getPlayerRankings;

export async function getRankingLeaderboard(rankingId: string, limit = 20): Promise<LeaderboardFull> {
  const raw = await getJson<BackendLeaderboard>(`/v1/player/rankings/${rankingId}/leaderboard`, {
    params: { limit },
  });
  return adaptLeaderboard(raw, rankingId);
}
