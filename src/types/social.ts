import type { Reward } from './reward';

export type NewsCategory = 'promo' | 'evento' | 'anuncio' | 'sistema';
export type PredictionStatus = 'pendiente' | 'ganada' | 'perdida';
export type NotificationKind = 'reward' | 'mission' | 'social' | 'tournament' | 'system' | 'system_event';
export type FeedScope = 'following' | 'explore';

export interface SharedPick {
  id: string;
  teams: string;
  prediction: string;
  odds: number;
  status: PredictionStatus;
}

export type FeedPostKind = 'thought' | 'bet_ticket';

export interface BetSlipLeg {
  teams: string;
  prediction: string;
  odds: number;
}

/** Combined ticket (provider auto-post or user publishing several picks). */
export interface BetSlipShare {
  id: string;
  legs: BetSlipLeg[];
  totalOdds: number;
  status: PredictionStatus;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  /** Handle shown on bet tickets (e.g. JUAN8021). Falls back to authorName. */
  username?: string;
  authorAvatar: string;
  vipTier?: string;
  level: number;
  createdAt: string;
  kind?: FeedPostKind;
  body: string;
  imageUrl?: string;
  likes: number;
  likedByMe?: boolean;
  comments: number;
  /** Single pick (legacy / simple posts). */
  sharedPick?: SharedPick;
  /** Full ticket with several selections + total odds. */
  betSlip?: BetSlipShare;
  accuratePrediction?: {
    detail: string;
    xp: number;
  };
  pendingReview?: boolean;
}

export interface FeedComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  createdAt: string;
}

export interface ShareablePick {
  id: string;
  teams: string;
  prediction: string;
  odds: number;
  status: PredictionStatus;
  placedAt: string;
}

export interface CreatePostInput {
  body: string;
  sharePickId?: string;
  /** Build a combined ticket (1+ legs). Prefer over sharePickId when multiple. */
  sharePickIds?: string[];
  kind?: FeedPostKind;
}

export interface LikePostResponse {
  postId: string;
  likes: number;
  likedByMe: boolean;
}

export interface CopyPickResponse {
  postId: string;
  pickId: string;
  teams: string;
  prediction: string;
  odds: number;
  totalOdds?: number;
  legs?: BetSlipLeg[];
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
