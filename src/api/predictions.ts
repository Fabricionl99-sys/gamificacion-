import { apiClient } from './client';
import type { PredictionEvent, PredictionStatus } from '../types/prediction';

export type PredictionStatusFilter = 'active' | 'my' | 'past';

/**
 * Backend shape de `/v1/player/predictions` (TournamentRow del módulo de
 * predicciones). El backend NO tiene `sport`, `items`, `participants_count`,
 * `pool_accumulated` — son conceptos del widget que no se modelaron server-side
 * aún. Stubbeamos con defaults hasta que el detail endpoint hidrate.
 */
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
}

function mapStatus(s: BackendPredictionTournament['status']): PredictionStatus {
  if (s === 'closed') return 'past';
  if (s === 'in_progress') return 'closed_pending';
  return 'active';
}

function adaptList(t: BackendPredictionTournament): PredictionEvent {
  // grand_prize_amount = primer item del prize_distribution (posición #1).
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
    // items vacío en list — populated en detail.
    items: [],
    participants_count: 0,
    pool_accumulated: 0,
    already_predicted: false,
  };
}

export async function getPredictionEvents(filter: PredictionStatusFilter = 'active'): Promise<PredictionEvent[]> {
  // Backend `/v1/player/predictions` no acepta query `?status=`. Trae todos los
  // open/in_progress/closed y filtramos client-side por tab.
  const response = await apiClient.get<BackendPredictionTournament[]>('/v1/player/predictions');
  const all = response.data.map(adaptList);
  if (filter === 'active') return all.filter((e) => e.status === 'active');
  if (filter === 'past') return all.filter((e) => e.status === 'past');
  // 'my' → con backend actual no sabemos cuál predijo el jugador desde list.
  // Por ahora devuelve los abiertos. Real check requiere fetch detail por cada uno.
  return all.filter((e) => e.status === 'active');
}

export async function getPredictionEvent(id: string): Promise<PredictionEvent | null> {
  // Backend detail trae { tournament, events[], myPredictions[] } pero el widget
  // espera PredictionEvent con items inline. Hasta tener adapter completo de
  // detail, devolvemos null → el modal no abre (Modal hace guard si event=null).
  // TODO Sprint #7: adapter completo backend PlayerTournamentView → PredictionEvent.
  const response = await apiClient.get(`/v1/player/predictions/${id}`);
  void response;
  return null;
}

export async function submitPrediction(
  eventId: string,
  predictions: Record<string, string>,
): Promise<void> {
  // Backend espera `POST /v1/player/predictions/predictions` con body
  // `{event_id, option_id}` — UNA predicción a la vez. El widget manda varias.
  // Por ahora hacemos N requests. TODO consolidar cuando widget tenga adapter.
  await Promise.all(
    Object.entries(predictions).map(([event_id, option_id]) =>
      apiClient.post(`/v1/player/predictions/predictions`, { event_id, option_id }),
    ),
  );
  void eventId;
}
