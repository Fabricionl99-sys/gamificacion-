import { apiClient } from './client';
import { unwrapData } from '../lib/apiResponse';
import { normalizeDemoSession, type DemoSession } from '../lib/normalizeDemoSession';

export type { DemoSession };

export async function createDemoSession(existingPlayerId?: string | null): Promise<DemoSession> {
  const body = existingPlayerId ? { existing_player_id: existingPlayerId } : {};
  const { data } = await apiClient.post<unknown>('/v1/public/demo/session', body);
  return normalizeDemoSession(unwrapData<Record<string, unknown>>(data));
}

/** Mint a fresh demo player (td reset → external_player_id + jwt). */
export async function resetDemoSession(): Promise<DemoSession> {
  const { data } = await apiClient.post<unknown>('/v1/public/demo/session/reset');
  return normalizeDemoSession(unwrapData<Record<string, unknown>>(data));
}
