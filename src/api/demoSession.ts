import { apiClient } from './client';
import { unwrapData } from '../lib/apiResponse';

export interface DemoSession {
  access_token: string;
  player_id: string;
  tenant_id: string;
}

export async function createDemoSession(existingPlayerId?: string | null): Promise<DemoSession> {
  const body = existingPlayerId ? { existing_player_id: existingPlayerId } : {};
  const { data } = await apiClient.post<unknown>('/v1/public/demo/session', body);
  return unwrapData<DemoSession>(data);
}

export async function resetDemoSession(): Promise<void> {
  await apiClient.post('/v1/public/demo/session/reset');
}
