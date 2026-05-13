export interface LevelDefinition {
  level: number;
  displayName?: string;
  badgeImageUrl?: string;
  /** XP acumulado mínimo para alcanzar este nivel (opcional; si falta, la barra usa currentXP/nextLevelXP). */
  xpThreshold?: number;
}
