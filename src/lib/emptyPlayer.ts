import type { Player } from '../types/player';

/** Estado inicial del jugador antes de cargar /v1/player/me — sin datos demo. */
export const EMPTY_PLAYER: Player = {
  id: '',
  name: 'Jugador',
  username: '',
  avatar: '',
  level: 1,
  currentXP: 0,
  nextLevelXP: 1,
  streak: 0,
  bestStreak: 0,
  coins: 0,
  vipTier: 'none',
  bio: '',
  pendingPrizes: 0,
  unreadNotifications: 0,
  wallet: [],
};

export function isProductionWidget(): boolean {
  return import.meta.env.VITE_USE_MOCKS === 'false';
}
