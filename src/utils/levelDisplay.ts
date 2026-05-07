import type { LevelDefinition } from '../types/levels';

export function resolveLevelDisplayName(level: number, tiers: LevelDefinition[]): string {
  let last = '';
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  for (const t of sorted) {
    if (t.level > level) break;
    if (t.displayName?.trim()) last = t.displayName.trim();
  }
  return last || `Nivel ${level}`;
}

export function resolveLevelBadgeUrl(level: number, tiers: LevelDefinition[]): string | undefined {
  let url: string | undefined;
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  for (const t of sorted) {
    if (t.level > level) break;
    if (t.badgeImageUrl) url = t.badgeImageUrl;
  }
  return url;
}
