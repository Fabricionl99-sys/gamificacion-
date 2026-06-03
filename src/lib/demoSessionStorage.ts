const PLAYER_KEY = 's2g_demo_player_id';
const TOKEN_KEY = 's2g_demo_access_token';
const CURRENCY_KEY = 's2g_demo_currency_code';

export function getStoredDemoPlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(PLAYER_KEY) ?? localStorage.getItem(PLAYER_KEY);
}

export function getStoredDemoAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
}

export function getStoredDemoCurrencyCode(): string | null {
  if (typeof window === 'undefined') return null;
  const code = localStorage.getItem(CURRENCY_KEY)?.trim();
  return code ? code.toUpperCase() : null;
}

export function persistDemoSession(playerId: string, accessToken: string): void {
  sessionStorage.setItem(PLAYER_KEY, playerId);
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(PLAYER_KEY, playerId);
  localStorage.setItem(TOKEN_KEY, accessToken);
}

export function persistDemoCurrencyCode(currencyCode: string): void {
  const code = currencyCode.trim().toUpperCase();
  if (!code) return;
  localStorage.setItem(CURRENCY_KEY, code);
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(PLAYER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PLAYER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENCY_KEY);
}
