import type { Mission } from '../types/mission';

export function isMissionDone(mission: Mission) {
  return mission.status === 'completed' || mission.status === 'claimed';
}

export function getDailyMissionStats(missions: Mission[]) {
  const daily = missions.filter((mission) => mission.group === 'daily' && mission.status !== 'expired');
  const done = daily.filter(isMissionDone).length;
  const claimable = daily.filter((mission) => mission.status === 'completed').length;
  const earnedXP = daily
    .filter((mission) => mission.status === 'claimed')
    .reduce((total, mission) => total + mission.rewardXP, 0);

  return {
    daily,
    done,
    total: daily.length,
    claimable,
    earnedXP,
  };
}
