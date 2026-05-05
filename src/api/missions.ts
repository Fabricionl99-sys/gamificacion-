import { apiClient } from './client';
import type { Mission } from '../types/mission';

export async function getMissions() {
  const response = await apiClient.get<Mission[]>('/player/missions');
  return response.data;
}
