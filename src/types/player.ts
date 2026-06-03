import type { LevelDefinition } from './levels';
import type { WalletCurrency } from './currency';

export type VipTier = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Player {
  id: string;
  name: string;
  username: string;
  avatar: string;
  /** CDN URL del avatar activo (image_urls.original o image_url del backend). */
  avatarImageUrl?: string | null;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
  bestStreak: number;
  coins: number;
  /** Moneda de juego asignada al jugador (demo / currency-aware missions). */
  currencyCode?: string | null;
  vipTier: VipTier;
  bio: string;
  pendingPrizes: number;
  unreadNotifications: number;
  isPrivate?: boolean;
  followers?: number;
  following?: number;
  /** Curva de niveles del operador (nombres e insignias por nivel) */
  levelDefinitions?: LevelDefinition[];
  /** Balances por moneda con imagen */
  wallet?: WalletCurrency[];
}

export interface PublicPlayer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  vipTier: VipTier;
  weeklyXP: number;
  position: number;
  isAnonymous?: boolean;
  isSelf?: boolean;
}
