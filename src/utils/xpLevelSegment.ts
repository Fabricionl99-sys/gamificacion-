import type { LevelDefinition } from '../types/levels';
import type { Player } from '../types/player';

export type XpSegment = {
  progressPercent: number;
  displayCurrent: number;
  displayNext: number;
};

/** XP mínimo del nivel actual según umbrales opcionales en la curva. */
export function resolveLevelXpFloor(level: number, tiers: LevelDefinition[] | undefined): number {
  if (!tiers?.length) return 0;
  let floor = 0;
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  for (const t of sorted) {
    if (t.level > level) break;
    if (typeof t.xpThreshold === 'number') floor = t.xpThreshold;
  }
  return floor;
}

/**
 * Barra: (xp_actual - xp_piso) / (xp_techo - xp_piso).
 * Sin umbrales en la curva, mantiene proporción currentXP / nextLevelXP (compatibilidad).
 */
export function resolveXpSegment(player: Player): XpSegment {
  const { currentXP, nextLevelXP, level, levelDefinitions } = player;
  const floor = resolveLevelXpFloor(level, levelDefinitions);
  const hasThresholds = (levelDefinitions ?? []).some((t) => typeof t.xpThreshold === 'number');

  if (hasThresholds && nextLevelXP > floor) {
    const span = nextLevelXP - floor;
    const into = currentXP - floor;
    const progressPercent = span > 0 ? Math.min(100, Math.max(0, (into / span) * 100)) : 0;
    return {
      progressPercent,
      displayCurrent: Math.max(0, into),
      displayNext: span,
    };
  }

  if (hasThresholds) {
    return {
      progressPercent: 0,
      displayCurrent: Math.max(0, currentXP - floor),
      displayNext: Math.max(0, nextLevelXP - floor),
    };
  }

  const denom = nextLevelXP > 0 ? nextLevelXP : 1;
  return {
    progressPercent: Math.min(100, Math.max(0, (currentXP / denom) * 100)),
    displayCurrent: currentXP,
    displayNext: nextLevelXP,
  };
}
