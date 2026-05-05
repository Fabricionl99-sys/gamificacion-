import type { XPBoost } from '../../../types/boost';
import type { Mission } from '../../../types/mission';

const missionMatchesBoost = (mission: Pick<Mission, 'category' | 'ruleId'>, boost: XPBoost) =>
  mission.ruleId === boost.rule_id ||
  (!mission.ruleId &&
    (mission.category === 'deportes' || mission.category === 'predicciones' || boost.rule_id.includes(mission.category)));

export function getBestMissionBoost(mission: Pick<Mission, 'category' | 'ruleId'>, boosts: XPBoost[]) {
  return boosts.filter((boost) => missionMatchesBoost(mission, boost)).sort((a, b) => b.multiplier - a.multiplier)[0];
}
