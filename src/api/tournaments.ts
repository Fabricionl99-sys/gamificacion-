import type { Tournament, TournamentStatus } from '../types/tournament';
import { apiClient } from './client';

/**
 * Backend shape de `/v1/player/tournaments` (sub-set de TournamentRow).
 * El backend solo expone torneos visibles con status `'active' | 'finished'`
 * (ver `tournament.service.ts:listVisibleTournaments`).
 */
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
}

/**
 * Backend usa `'active' | 'finished' | 'draft' | 'cancelled'` mientras que el
 * widget categoriza por estado visual `'live' | 'open' | 'vip' | 'almostFull'
 * | 'finished'`. Mapeo simple: `'finished'` y `'cancelled'` → `'finished'`,
 * todo lo demás → `'open'`. `'live' | 'vip' | 'almostFull'` requieren data
 * que el backend no expone aún (start time vs now, capacity %, restrictions).
 */
function mapStatus(status: BackendTournament['status']): TournamentStatus {
  if (status === 'finished' || status === 'cancelled') return 'finished';
  return 'open';
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

function adapt(t: BackendTournament): Tournament {
  const now = new Date();
  const started = new Date(t.period_starts_at).getTime() <= now.getTime();
  return {
    id: t.id,
    name: t.name,
    description: t.description || '',
    status: mapStatus(t.status),
    // Prize pool, participants, capacity no están en /v1/player/tournaments
    // (require GET /v1/player/tournaments/:code para detail + leaderboard).
    // Stubs visualmente neutros hasta que el widget fetchee el detail.
    prizePool: '—',
    participants: 0,
    capacity: 0,
    startsIn: started ? undefined : formatTimeDelta(t.period_starts_at, now),
    endsIn: started ? formatTimeDelta(t.period_ends_at, now) : undefined,
  };
}

export async function getTournaments(): Promise<Tournament[]> {
  const { data } = await apiClient.get<BackendTournament[]>('/v1/player/tournaments');
  return data.map(adapt);
}
