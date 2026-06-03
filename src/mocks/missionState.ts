import type { Mission } from '../types/mission';
import { mockBackendPlayerMissions, mockMissionsAsPlayerRows } from './playerMissions';
import { mockMissions } from './index';

let missions = structuredClone(mockMissions);

export const missionState = {
  list: () => [...mockBackendPlayerMissions, ...mockMissionsAsPlayerRows(missions)],
  claim: (id: string) => {
    const backend = mockBackendPlayerMissions.find((m) => m.mission_assignment_id === id);
    if (backend) {
      if (backend.status !== 'completed') throw new Error('MISSION_NOT_CLAIMABLE');
      backend.claimed_at = new Date().toISOString() as typeof backend.claimed_at;
      backend.status = 'claimed';
      return { mission: backend, rewardXP: 120, rewardCoins: 0 };
    }
    const mission = missions.find((entry) => entry.id === id);
    if (!mission) throw new Error('MISSION_NOT_FOUND');
    if (mission.status !== 'completed') throw new Error('MISSION_NOT_CLAIMABLE');
    mission.status = 'claimed';
    mission.claimedAt = new Date().toISOString();
    return {
      mission,
      rewardXP: mission.rewardXP,
      rewardCoins: mission.rewardCoins ?? 0,
    };
  },
  reset: () => {
    missions = structuredClone(mockMissions);
  },
};
