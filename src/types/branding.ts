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
  heading_weight: string;
  body_weight: string;
}

export interface PublicBrandingConfig {
  tenant_id: string;
  operator_name?: string;
  color_palette: ColorPalette;
  typography: BrandingTypography;
  logo_url: string | null;
  favicon_url: string | null;
  background_image_url: string | null;
  welcome_text: string;
  custom_css?: string | null;
}
