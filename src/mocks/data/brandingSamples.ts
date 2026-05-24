import type { PublicBrandingConfig } from '../../types/branding';

/** Muestras para MSW — tenant_id debe coincidir con el BO (`brandingConfig.tenant_id`). */
export const BRANDING_SAMPLES: Record<string, PublicBrandingConfig> = {
  social2game: {
    tenant_id: 'social2game',
    operator_name: 'Social2Game',
    color_palette: {
      primary_color: '#0AF784',
      secondary_color: '#13181F',
      accent_color: '#0AF784',
      background_color: '#0A0E13',
      text_color: '#FFFFFF',
    },
    typography: { font_family: 'Urbanist', heading_weight: '700', body_weight: '500' },
    logo_url: null,
    favicon_url: null,
    background_image_url: null,
    welcome_text: 'Bienvenido a tu experiencia de gamificación',
    vapid_public_key: 'BNcRdreALRFXTkOuo_kSib-QyaSYG4cc_a1ZWFM91ftKUxr82isY2X5Rg9Z7XkH-Xp-6e8H20s0g7xU7eEw',
  },
  'tenant-demo': {
    tenant_id: 'tenant-demo',
    operator_name: 'Demo',
    color_palette: {
      primary_color: '#0AF784',
      secondary_color: '#13181F',
      accent_color: '#0AF784',
      background_color: '#0A0E13',
      text_color: '#FFFFFF',
    },
    typography: { font_family: 'Urbanist', heading_weight: '700', body_weight: '500' },
    logo_url: null,
    favicon_url: null,
    background_image_url: null,
    welcome_text: 'WINGOAT · Widget jugador demo',
  },
  op_casino_astral: {
    tenant_id: 'op_casino_astral',
    operator_name: 'Astral Casino',
    color_palette: {
      primary_color: '#6366f1',
      secondary_color: '#1e1b4b',
      accent_color: '#a78bfa',
      background_color: '#030712',
      text_color: '#e0e7ff',
    },
    typography: { font_family: 'Inter', heading_weight: '700', body_weight: '400' },
    logo_url: 'https://dummyimage.com/256x256/6366f1/ffffff&text=A',
    favicon_url: null,
    background_image_url: null,
    welcome_text: 'Astral VIP Club',
  },
  op_latambet: {
    tenant_id: 'op_latambet',
    operator_name: 'LatamBet',
    color_palette: {
      primary_color: '#b91c1c',
      secondary_color: '#1c1917',
      accent_color: '#fbbf24',
      background_color: '#0c0a09',
      text_color: '#fafaf9',
    },
    typography: { font_family: 'Inter', heading_weight: '700', body_weight: '500' },
    logo_url: 'https://dummyimage.com/256x256/b91c1c/ffffff&text=L',
    favicon_url: null,
    background_image_url: null,
    welcome_text: 'LatamBet Rewards — jugá y ganá',
  },
};

export function resolveBrandingSample(tenantId: string): PublicBrandingConfig {
  return (
    BRANDING_SAMPLES[tenantId] ?? {
      ...BRANDING_SAMPLES.social2game!,
      tenant_id: tenantId,
      operator_name: tenantId,
      welcome_text: `Experiencia ${tenantId}`,
    }
  );
}
