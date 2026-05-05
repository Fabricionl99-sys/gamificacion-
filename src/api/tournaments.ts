import type { Tournament } from '../types/tournament';
import { apiClient } from './client';

export async function getTournaments(): Promise<Tournament[]> {
  const { data } = await apiClient.get<Tournament[]>('/player/tournaments');
  return data;
}
