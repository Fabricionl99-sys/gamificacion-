/** Contrato público branding — alineado con BO `/admin/branding` y GET `/v1/public/branding/:tenantId`. */
export type BorderRadiusScale = 'sharp' | 'rounded' | 'very_rounded';
export type AnimationsIntensity = 'none' | 'subtle' | 'playful';

export interface ColorPalette {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
}

export interface BrandingExtendedColors {
  profile_card_color: string;
  progress_bar_fill_color: string;
  progress_bar_track_color: string;
  border_color: string;
  text_secondary_color: string;
  success_color: string;
  warning_color: string;
  error_color: string;
  badge_color: string;
  chest_rarity_common_color: string;
  chest_rarity_rare_color: string;
  chest_rarity_epic_color: string;
  chest_rarity_legendary_color: string;
}

export interface BrandingTypography {
  font_family: string;
  font_size_base?: string;
  heading_weight: string;
  body_weight: string;
  heading_font_family?: string;
}

export interface PublicBrandingConfig {
  tenant_id: string;
  operator_name?: string;
  color_palette: ColorPalette;
  typography: BrandingTypography;
  theme_mode?: string;
  logo_url: string | null;
  favicon_url: string | null;
  background_image_url: string | null;
  welcome_text: string;
  custom_css?: string | null;
  last_updated_at?: string | null;
  vapid_public_key?: string | null;
  profile_card_color?: string | null;
  progress_bar_fill_color?: string | null;
  progress_bar_track_color?: string | null;
  border_color?: string | null;
  text_secondary_color?: string | null;
  success_color?: string | null;
  warning_color?: string | null;
  error_color?: string | null;
  badge_color?: string | null;
  chest_rarity_common_color?: string | null;
  chest_rarity_rare_color?: string | null;
  chest_rarity_epic_color?: string | null;
  chest_rarity_legendary_color?: string | null;
  border_radius_scale?: BorderRadiusScale | null;
  level_label?: string | null;
  level_up_message_template?: string | null;
  animations_intensity?: AnimationsIntensity | null;
}
