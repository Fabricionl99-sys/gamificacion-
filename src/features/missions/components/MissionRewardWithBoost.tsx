import type { XPBoost } from '../../../types/boost';
import type { Mission } from '../../../types/mission';
import { formatNumber } from '../../../utils/format';
import { getBestMissionBoost } from './missionBoost';

interface MissionRewardWithBoostProps {
  mission: Pick<Mission, 'rewardXP' | 'category' | 'ruleId'>;
  boosts: XPBoost[];
}

export function MissionRewardWithBoost({ mission, boosts }: MissionRewardWithBoostProps) {
  const boost = getBestMissionBoost(mission, boosts);
  const boostedXP = boost ? mission.rewardXP * boost.multiplier : null;

  return (
    <span>
      +{formatNumber(mission.rewardXP)} XP
      {boost && boostedXP ? (
        <span className="ml-1 text-accent">(+{formatNumber(boostedXP)} con x{boost.multiplier} activo)</span>
      ) : null}
    </span>
  );
}
