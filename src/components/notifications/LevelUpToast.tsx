import type { LevelDefinition } from '../../types/levels';
import { resolveLevelDisplayName } from '../../utils/levelDisplay';

/** Mensaje principal para level-up (modal, toast o push). */
export function buildLevelUpHeadline(fromLevel: number, toLevel: number, tiers: LevelDefinition[]): string {
  const fromDisplay = resolveLevelDisplayName(fromLevel, tiers);
  const toDisplay = resolveLevelDisplayName(toLevel, tiers);
  const generic = (lv: number, label: string) => label === `Nivel ${lv}`;
  const fromGen = generic(fromLevel, fromDisplay);
  const toGen = generic(toLevel, toDisplay);

  if (!fromGen && !toGen && fromDisplay !== toDisplay) {
    return `¡Subiste de ${fromDisplay} a ${toDisplay}!`;
  }
  if (!toGen) {
    return `¡Subiste a ${toDisplay}!`;
  }
  return `¡Subiste a Nivel ${toLevel}!`;
}
