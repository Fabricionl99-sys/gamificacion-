import { apiClient } from './client';
import type { XPBoost } from '../types/boost';

export async function getActiveBoosts(): Promise<XPBoost[]> {
  return apiClient.get('/v1/player/active-boosts').then((response) => response.data as XPBoost[]);
}
