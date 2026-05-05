import { apiClient } from './client';
import type { Achievement } from '../types/achievement';

export async function getAchievements(): Promise<Achievement[]> {
  return apiClient.get('/player/achievements').then((response) => response.data as Achievement[]);
}
