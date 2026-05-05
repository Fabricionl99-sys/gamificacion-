import type { Reward } from './reward';

export type NewsCategory = 'promo' | 'evento' | 'anuncio' | 'sistema';
export type PredictionStatus = 'pendiente' | 'ganada' | 'perdida';
export type NotificationKind = 'reward' | 'mission' | 'social' | 'tournament' | 'system' | 'system_event';

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  vipTier?: string;
  level: number;
  createdAt: string;
  body: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  sharedPick?: {
    teams: string;
    prediction: string;
    odds: number;
    status: PredictionStatus;
  };
  accuratePrediction?: {
    detail: string;
    xp: number;
  };
  pendingReview?: boolean;
}

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  body: string;
  createdAt: string;
  expiresAt?: string;
  ctaLabel?: string;
  systemCentral?: boolean;
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
  permanent?: boolean;
}

export interface ProfilePrize extends Reward {
  expiresAt: string;
  urgent?: boolean;
}
