/** Contrato público branding — alineado con BO `/admin/branding` y API para Code. */
export interface ColorPalette {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
}

export interface BrandingTypography {
  font_family: string;
  /** sm | md | lg | xl — mapeado a 12/14/16/18 px base por applyBranding. */
  font_size_base?: string;
  heading_weight: string;
  body_weight: string;
}

export interface PublicBrandingConfig {
  tenant_id: string;
  operator_name?: string;
  color_palette: ColorPalette;
  typography: BrandingTypography;
  /** light | dark | auto. auto sigue prefers-color-scheme. Default dark. */
  theme_mode?: string;
  logo_url: string | null;
  favicon_url: string | null;
  background_image_url: string | null;
  welcome_text: string;
  custom_css?: string | null;
  last_updated_at?: string | null;
}
