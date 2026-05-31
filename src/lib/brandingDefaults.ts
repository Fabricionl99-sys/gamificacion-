import type {
  AnimationsIntensity,
  BorderRadiusScale,
  BrandingExtendedColors,
  ColorPalette,
  PublicBrandingConfig,
} from '../types/branding';

export const DEFAULT_LEVEL_LABEL = 'Nivel';
export const DEFAULT_LEVEL_UP_TEMPLATE = '¡Subiste al nivel {level}!';
export const DEFAULT_ANIMATIONS_INTENSITY: AnimationsIntensity = 'subtle';
export const DEFAULT_BORDER_RADIUS_SCALE: BorderRadiusScale = 'rounded';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = hex.replace('#', '');
  if (n.length !== 6) return null;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function deriveExtendedColors(palette: ColorPalette): BrandingExtendedColors {
  return {
    profile_card_color: palette.secondary_color,
    progress_bar_fill_color: palette.accent_color,
    progress_bar_track_color: palette.secondary_color,
    border_color: withAlpha(palette.text_color, 0.12),
    text_secondary_color: withAlpha(palette.text_color, 0.65),
    success_color: '#10B981',
    warning_color: '#FFB020',
    error_color: '#FF4D6D',
    badge_color: palette.primary_color,
    chest_rarity_common_color: '#9CA3AF',
    chest_rarity_rare_color: '#4D9FFF',
    chest_rarity_epic_color: '#A855F7',
    chest_rarity_legendary_color: '#FFB020',
  };
}

export function resolvePublicBrandingConfig(config: PublicBrandingConfig): PublicBrandingConfig & BrandingExtendedColors {
  const derived = deriveExtendedColors(config.color_palette);

  return {
    ...config,
    profile_card_color: config.profile_card_color ?? derived.profile_card_color,
    progress_bar_fill_color: config.progress_bar_fill_color ?? derived.progress_bar_fill_color,
    progress_bar_track_color: config.progress_bar_track_color ?? derived.progress_bar_track_color,
    border_color: config.border_color ?? derived.border_color,
    text_secondary_color: config.text_secondary_color ?? derived.text_secondary_color,
    success_color: config.success_color ?? derived.success_color,
    warning_color: config.warning_color ?? derived.warning_color,
    error_color: config.error_color ?? derived.error_color,
    badge_color: config.badge_color ?? derived.badge_color,
    chest_rarity_common_color: config.chest_rarity_common_color ?? derived.chest_rarity_common_color,
    chest_rarity_rare_color: config.chest_rarity_rare_color ?? derived.chest_rarity_rare_color,
    chest_rarity_epic_color: config.chest_rarity_epic_color ?? derived.chest_rarity_epic_color,
    chest_rarity_legendary_color: config.chest_rarity_legendary_color ?? derived.chest_rarity_legendary_color,
    border_radius_scale: config.border_radius_scale ?? DEFAULT_BORDER_RADIUS_SCALE,
    level_label: config.level_label?.trim() || DEFAULT_LEVEL_LABEL,
    level_up_message_template: config.level_up_message_template?.trim() || DEFAULT_LEVEL_UP_TEMPLATE,
    animations_intensity: config.animations_intensity ?? DEFAULT_ANIMATIONS_INTENSITY,
  };
}

export function formatLevelUpMessage(
  template: string,
  tokens: { level: number; level_name?: string; player_name?: string },
): string {
  return template
    .split('{level}').join(String(tokens.level))
    .split('{level_name}').join(tokens.level_name ?? `Nivel ${tokens.level}`)
    .split('{player_name}').join(tokens.player_name ?? '');
}

export const RADIUS_BY_SCALE: Record<BorderRadiusScale, { sm: string; md: string; lg: string; xl: string }> = {
  sharp: { sm: '2px', md: '4px', lg: '6px', xl: '8px' },
  rounded: { sm: '6px', md: '10px', lg: '16px', xl: '24px' },
  very_rounded: { sm: '8px', md: '12px', lg: '16px', xl: '20px' },
};
