import type { Tournament, TournamentStatus } from '../types/tournament';
import { parseSafeDate, safeFormatTimeDelta } from '../utils/date';
import { getJson } from './fetchJson';

interface BackendTournament {
  id: string;
  code: string;
  name: string;
  description: string;
  image_url: string | null;
  status: 'draft' | 'active' | 'finished' | 'cancelled';
  period_starts_at: string | null;
  period_ends_at: string | null;
  is_visible_to_players: boolean;
  max_visible_positions: number;
  registrations_count?: number;
  is_registered?: boolean;
  prizes?: Array<{
    position_from: number;
    position_to: number;
    reward_type: string;
    reward_config?: { amount?: number; currency_code?: string };
  }>;
}

function mapStatus(
  status: BackendTournament['status'],
  startsAt: string | null,
  endsAt: string | null,
): TournamentStatus {
  if (status === 'finished' || status === 'cancelled') return 'finished';
  const start = parseSafeDate(startsAt)?.getTime();
  const end = parseSafeDate(endsAt)?.getTime();
  if (start == null || end == null) return 'open';
  const now = Date.now();
  if (now >= start && now <= end) return 'live';
  if (now < start) return 'open';
  return 'open';
}

function formatPrizePool(prizes?: BackendTournament['prizes']): string {
  const first = prizes?.find((p) => p.position_from === 1) ?? prizes?.[0];
  const amount = first?.reward_config?.amount;
  if (amount == null) return '—';
  const code = first?.reward_config?.currency_code;
  return code ? `${amount} ${code}` : String(amount);
}

function adapt(t: BackendTournament): Tournament {
  const now = new Date();
  const start = parseSafeDate(t.period_starts_at);
  const started = start != null && start.getTime() <= now.getTime();
  return {
    id: t.id,
    code: t.code,
    name: t.name,
    description: t.description || '',
    status: mapStatus(t.status, t.period_starts_at, t.period_ends_at),
    prizePool: formatPrizePool(t.prizes),
    participants: t.registrations_count ?? 0,
    capacity: t.max_visible_positions ?? 0,
    startsIn: started ? undefined : safeFormatTimeDelta(t.period_starts_at, now),
    endsIn: started ? safeFormatTimeDelta(t.period_ends_at, now) : undefined,
    isRegistered: t.is_registered,
  };
}

export async function getTournaments(): Promise<Tournament[]> {
  const rows = await getJson<BackendTournament[]>('/v1/player/tournaments');
  return rows.filter((t) => t.is_visible_to_players && t.status !== 'draft').map(adapt);
}

export async function getTournamentDetail(code: string): Promise<Tournament | null> {
  try {
    const row = await getJson<BackendTournament>(`/v1/player/tournaments/${code}`);
    return adapt(row);
  } catch {
    return null;
  }
}
