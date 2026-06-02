export interface DemoSession {
  access_token: string;
  player_id: string;
  external_player_id: string;
  tenant_id?: string | null;
}

/** Accepts legacy `{ access_token, player_id }` and td reset `{ jwt, external_player_id }`. */
export function normalizeDemoSession(raw: Record<string, unknown>): DemoSession {
  const accessToken =
    typeof raw.access_token === 'string'
      ? raw.access_token
      : typeof raw.jwt === 'string'
        ? raw.jwt
        : '';
  const externalPlayerId =
    typeof raw.external_player_id === 'string'
      ? raw.external_player_id
      : typeof raw.player_id === 'string'
        ? raw.player_id
        : '';
  const playerId = typeof raw.player_id === 'string' ? raw.player_id : externalPlayerId;

  if (!accessToken || !playerId) {
    throw new Error('Respuesta de sesión demo inválida');
  }

  return {
    access_token: accessToken,
    player_id: playerId,
    external_player_id: externalPlayerId || playerId,
    tenant_id: typeof raw.tenant_id === 'string' ? raw.tenant_id : null,
  };
}
