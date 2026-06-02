export type PredictionMarket =
  | 'result_1x2'
  | 'winner_2options'
  | 'total_goals'
  | 'total_corners'
  | 'both_score'
  | 'exact_score';

export type PredictionStatus = 'active' | 'closed_pending' | 'past' | 'draft';
export type PredictionSport = 'football' | 'tennis' | 'basketball' | 'ufc' | 'other';

export interface PredictionItem {
  id: string;
  position: number;
  name: string;
  market: PredictionMarket;
  prize_amount: number;
  player_prediction?: string;
  result?: string;
  options?: PredictionMarketOption[];
}

export interface PredictionEvent {
  id: string;
  name: string;
  description: string;
  sport: PredictionSport;
  status: PredictionStatus;
  closes_at: string | null;
  entry_cost: number;
  grand_prize_amount: number;
  items: PredictionItem[];
  participants_count: number;
  pool_accumulated: number;
  already_predicted?: boolean;
}

export interface PredictionMarketOption {
  value: string;
  label: string;
}

export interface PredictionMarketDefinition {
  id: PredictionMarket;
  label: string;
  buttons: PredictionMarketOption[];
}
