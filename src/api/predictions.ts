import { getJson, postJson } from './fetchJson';
import type { PredictionEvent, PredictionStatus } from '../types/prediction';

export type PredictionStatusFilter = 'active' | 'my' | 'past';

interface BackendPredictionTournament {
  id: string;
  code: string;
  name: string;
  description: string;
  image_url: string | null;
  entry_cost_type: 'free' | 'coins' | 'currency';
  entry_cost_amount: string | number;
  entry_cost_currency_id: string | null;
  prize_distribution: Array<{
    position: number;
    reward_type: string;
    reward_config: { amount?: number; currency_code?: string };
  }>;
  status: 'draft' | 'open' | 'in_progress' | 'closed' | 'archived';
  entry_deadline: string;
  starts_at: string;
  ends_at: string;
  events?: BackendPredictionEvent[];
  my_entry?: unknown | null;
}

interface BackendPredictionEvent {
  id: string;
  order_index: number;
  question: string;
  image_url: string | null;
  predict_deadline_at: string;
  is_resolved: boolean;
  correct_option_id: string | null;
  options: Array<{ id: string; order_index: number; label: string; image_url: string | null }>;
  my_prediction?: { option_id?: string } | null;
}

function mapStatus(s: BackendPredictionTournament['status']): PredictionStatus {
  if (s === 'closed' || s === 'archived') return 'past';
  if (s === 'in_progress') return 'closed_pending';
  return 'active';
}

function adaptList(t: BackendPredictionTournament): PredictionEvent {
  const grand = t.prize_distribution[0]?.reward_config?.amount ?? 0;
  return {
    id: t.code,
    name: t.name,
    description: t.description ?? '',
    sport: 'other',
    status: mapStatus(t.status),
    closes_at: t.entry_deadline,
    entry_cost: Number(t.entry_cost_amount) || 0,
    grand_prize_amount: grand,
    items: [],
    participants_count: 0,
    pool_accumulated: 0,
    already_predicted: Boolean(t.my_entry),
  };
}

function adaptDetail(t: BackendPredictionTournament): PredictionEvent {
  const base = adaptList(t);
  const prizePerEvent =
    t.prize_distribution.length > 0
      ? Math.floor(base.grand_prize_amount / Math.max(t.events?.length ?? 1, 1))
      : 0;

  const items = (t.events ?? []).map((evt, idx) => ({
    id: evt.id,
    position: evt.order_index ?? idx + 1,
    name: evt.question,
    market: 'winner_2options' as const,
    prize_amount: prizePerEvent,
    player_prediction: evt.my_prediction?.option_id,
    result: evt.correct_option_id ?? undefined,
    options: (evt.options ?? []).map((opt) => ({
      value: opt.id,
      label: opt.label,
    })),
  }));

  return {
    ...base,
    items,
    already_predicted: items.some((item) => Boolean(item.player_prediction)),
  };
}

export async function getPredictionEvents(filter: PredictionStatusFilter = 'active'): Promise<PredictionEvent[]> {
  const all = (await getJson<BackendPredictionTournament[]>('/v1/player/predictions')).map(adaptList);
  if (filter === 'active') return all.filter((e) => e.status === 'active' || e.status === 'closed_pending');
  if (filter === 'past') return all.filter((e) => e.status === 'past');
  return all.filter((e) => e.already_predicted);
}

export async function getPredictionEvent(code: string): Promise<PredictionEvent | null> {
  try {
    const row = await getJson<BackendPredictionTournament>(`/v1/player/predictions/${code}`);
    return adaptDetail(row);
  } catch {
    return null;
  }
}

export async function submitPrediction(
  _programCode: string,
  predictions: Record<string, string>,
): Promise<void> {
  await Promise.all(
    Object.entries(predictions).map(([event_id, option_id]) =>
      postJson('/v1/player/predictions/predictions', { event_id, option_id }),
    ),
  );
}

/** Eventos abiertos para predicción (endpoint dedicado si el operador los expone). */
export async function getOpenPredictionEvents(): Promise<unknown[]> {
  try {
    return await getJson<unknown[]>('/v1/player/predictions/events');
  } catch {
    return [];
  }
}
