import type { Player } from '../types/player';
import { unwrapData } from '../lib/apiResponse';
import { normalizePlayer } from '../lib/normalizePlayer';
import { apiClient } from './client';

export const getPlayer = async (): Promise<Player> => {
  const { data } = await apiClient.get<unknown>('/v1/player/me');
  const payload = unwrapData<Record<string, unknown>>(data);
  return normalizePlayer(payload && typeof payload === 'object' ? payload : {});
};
