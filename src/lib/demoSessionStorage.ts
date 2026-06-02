const PLAYER_KEY = 's2g_demo_player_id';
const TOKEN_KEY = 's2g_demo_access_token';

export function getStoredDemoPlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(PLAYER_KEY);
}

export function getStoredDemoAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function persistDemoSession(playerId: string, accessToken: string): void {
  sessionStorage.setItem(PLAYER_KEY, playerId);
  sessionStorage.setItem(TOKEN_KEY, accessToken);
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(PLAYER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PLAYER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
