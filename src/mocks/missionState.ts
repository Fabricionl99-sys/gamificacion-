import type { Mission } from '../types/mission';
import { mockMissions } from './index';

let missions = structuredClone(mockMissions);

export const missionState = {
  list: (): Mission[] => missions,
  claim: (id: string) => {
    const mission = missions.find((entry) => entry.id === id);
    if (!mission) throw new Error('MISSION_NOT_FOUND');
    if (mission.status !== 'completed') throw new Error('MISSION_NOT_CLAIMABLE');
    mission.status = 'claimed';
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
