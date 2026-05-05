import type { Player } from '../types/player';
import { apiClient } from './client';

export const getPlayer = async (): Promise<Player> => {
  const { data } = await apiClient.get<Player>('/player/me');
  return data;
};
