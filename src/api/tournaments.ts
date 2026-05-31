import type { Tournament, TournamentStatus } from '../types/tournament';
import { getJson } from './fetchJson';

interface BackendTournament {
  id: string;
  code: string;
  name: string;
  description: string;
  image_url: string | null;
  status: 'draft' | 'active' | 'finished' | 'cancelled';
  period_starts_at: string;
  period_ends_at: string;
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

function formatTimeDelta(iso: string, now: Date = new Date()): string {
  const ts = new Date(iso).getTime();
  const diffMs = ts - now.getTime();
  if (diffMs <= 0) return 'finalizado';
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function mapStatus(status: BackendTournament['status'], startsAt: string, endsAt: string): TournamentStatus {
  if (status === 'finished' || status === 'cancelled') return 'finished';
  const now = Date.now();
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
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
  const started = new Date(t.period_starts_at).getTime() <= now.getTime();
  return {
    id: t.id,
    code: t.code,
    name: t.name,
    description: t.description || '',
    status: mapStatus(t.status, t.period_starts_at, t.period_ends_at),
    prizePool: formatPrizePool(t.prizes),
    participants: t.registrations_count ?? 0,
    capacity: t.max_visible_positions ?? 0,
    startsIn: started ? undefined : formatTimeDelta(t.period_starts_at, now),
    endsIn: started ? formatTimeDelta(t.period_ends_at, now) : undefined,
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
