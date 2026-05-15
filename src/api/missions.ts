import { apiClient } from './client';
import type { Mission } from '../types/mission';

export async function getMissions() {
  const response = await apiClient.get<Mission[]>('/player/missions');
  return response.data;
}

export interface ClaimMissionResult {
  mission: Mission;
  rewardXP: number;
  rewardCoins: number;
}

export async function claimMission(missionId: string) {
  const response = await apiClient.post<ClaimMissionResult>(`/player/missions/${missionId}/claim`);
  return response.data;
}
