import type { PredictionEvent, PredictionMarket } from '../types/prediction';
import type { PlayerRankingSummary } from '../types/ranking';
import type { ShopItem } from '../types/reward';
import type { Tournament } from '../types/tournament';

const predictionOptionLabels: Record<PredictionMarket, { id: string; label: string }[]> = {
  result_1x2: [
    { id: 'option1', label: 'Local' },
    { id: 'draw', label: 'Empate' },
    { id: 'option2', label: 'Visitante' },
  ],
  winner_2options: [
    { id: 'option1', label: 'Opción 1' },
    { id: 'option2', label: 'Opción 2' },
  ],
  total_goals: [
    { id: 'over', label: 'Más 2.5' },
    { id: 'under', label: 'Menos 2.5' },
  ],
  total_corners: [
    { id: 'over', label: 'Más 9.5' },
    { id: 'under', label: 'Menos 9.5' },
  ],
  both_score: [
    { id: 'yes', label: 'Sí' },
    { id: 'no', label: 'No' },
  ],
  exact_score: ['1-0', '1-1', '2-0', '2-1', '2-2', '3-1', 'otro'].map((value) => ({
    id: value,
    label: value,
  })),
};

export function toBackendPredictionList(event: PredictionEvent) {
  return {
    id: event.id,
    code: event.id,
    name: event.name,
    description: event.description,
    image_url: null,
    entry_cost_type: 'coins' as const,
    entry_cost_amount: event.entry_cost,
    entry_cost_currency_id: null,
    prize_distribution: [{ position: 1, reward_type: 'coins', reward_config: { amount: event.grand_prize_amount } }],
    status: event.status === 'past' ? 'closed' : event.status === 'closed_pending' ? 'in_progress' : 'open',
    entry_deadline: event.closes_at,
    starts_at: event.closes_at,
    ends_at: event.closes_at,
    my_entry:
      event.already_predicted || event.items.some((item) => item.player_prediction) ? {} : null,
  };
}

export function toBackendPredictionDetail(event: PredictionEvent) {
  return {
    ...toBackendPredictionList(event),
    events: event.items.map((item) => ({
      id: item.id,
      order_index: item.position,
      question: item.name,
      image_url: null,
      predict_deadline_at: event.closes_at,
      is_resolved: Boolean(item.result),
      correct_option_id: item.result ?? null,
      options: predictionOptionLabels[item.market].map((opt, idx) => ({
        id: opt.id,
        order_index: idx,
        label: opt.label,
        image_url: null,
      })),
      my_prediction: item.player_prediction ? { option_id: item.player_prediction } : null,
    })),
  };
}

export function toBackendRankingRows(rankings: PlayerRankingSummary[]) {
  return rankings.map((ranking) => ({
    code: ranking.ranking_id,
    name: ranking.ranking_name,
    description: '',
    image_url: null,
    metric_type: ranking.metric_label,
    period_type: ranking.window,
    current_period_end: ranking.closes_at,
    next_period_resets_at: ranking.closes_at,
    max_visible_positions: 100,
  }));
}

export function toBackendShopProducts(items: ShopItem[]) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image_url: item.imageUrl ?? null,
    cost_coins: item.cost,
    category: item.category,
    product_type: item.icon,
    stock: item.stock,
    low_stock_threshold: item.lowStockThreshold,
    vip_tier_required: item.vipRequired,
    ends_at: item.endsAt,
    featured: item.featured,
    disabled_reason: item.disabledReason ?? null,
  }));
}

export function toBackendTournaments(items: Tournament[]) {
  const now = Date.now();
  return items.map((tournament, index) => ({
    id: tournament.id,
    code: tournament.code ?? tournament.id,
    name: tournament.name,
    description: tournament.description,
    image_url: null,
    status: tournament.status === 'finished' ? 'finished' : 'active',
    period_starts_at: new Date(now - 86400000).toISOString(),
    period_ends_at: new Date(now + (index + 2) * 86400000).toISOString(),
    is_visible_to_players: true,
    max_visible_positions: tournament.capacity || 1000,
    registrations_count: tournament.participants,
    is_registered: tournament.isRegistered ?? false,
    prizes: [{ position_from: 1, position_to: 1, reward_type: 'coins', reward_config: { amount: 8000, currency_code: 'USD' } }],
  }));
}
