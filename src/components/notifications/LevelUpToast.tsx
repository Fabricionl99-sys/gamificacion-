import type { LevelDefinition } from '../../types/levels';
import { formatLevelUpMessage } from '../../lib/brandingDefaults';
import { useBrandingStore } from '../../store/brandingStore';
import { resolveLevelDisplayName } from '../../utils/levelDisplay';

/** Mensaje principal para level-up (modal, toast o push). */
export function buildLevelUpHeadline(
  fromLevel: number,
  toLevel: number,
  tiers: LevelDefinition[],
  playerName?: string,
): string {
  const branding = useBrandingStore.getState().config;
  const template = branding?.level_up_message_template;
  if (template) {
    return formatLevelUpMessage(template, {
      level: toLevel,
      level_name: resolveLevelDisplayName(toLevel, tiers),
      player_name: playerName,
    });
  }

  const fromDisplay = resolveLevelDisplayName(fromLevel, tiers);
  const toDisplay = resolveLevelDisplayName(toLevel, tiers);
  const levelLabel = branding?.level_label ?? document.documentElement.dataset.levelLabel ?? 'Nivel';
  const generic = (lv: number, label: string) => label === `${levelLabel} ${lv}` || label === `Nivel ${lv}`;
  const fromGen = generic(fromLevel, fromDisplay);
  const toGen = generic(toLevel, toDisplay);

  if (!fromGen && !toGen && fromDisplay !== toDisplay) {
    return `¡Subiste de ${fromDisplay} a ${toDisplay}!`;
  }
  if (!toGen) {
    return `¡Subiste a ${toDisplay}!`;
  }
  return `¡Subiste a ${levelLabel} ${toLevel}!`;
}
