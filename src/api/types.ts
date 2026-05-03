export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  statusCode: number;
  message: string;
  retryable: boolean;
}

export interface ApiResponse<TData> {
  data: TData;
  cachedAt?: string;
}

export type { AppNotification, FeedPost, NewsItem } from '../types/social';
export type { Mission } from '../types/mission';
export type { Player, PublicPlayer } from '../types/player';
export type { ShopItem } from '../types/reward';
export type { Tournament } from '../types/tournament';
