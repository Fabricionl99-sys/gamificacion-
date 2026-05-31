import { create } from 'zustand';

import { fetchPublicBranding } from '../api/branding';
import { applyBrandingConfig } from '../lib/applyBranding';
import { getTenantIdFromUrl } from '../lib/demoTenant';
import type { PublicBrandingConfig } from '../types/branding';

interface BrandingState {
  tenantId: string;
  config: PublicBrandingConfig | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  load: () => Promise<void>;
}

export const useBrandingStore = create<BrandingState>((set, get) => ({
  tenantId: getTenantIdFromUrl(),
  config: null,
  status: 'idle',
  error: null,
  load: async () => {
    const tenantId = getTenantIdFromUrl();
    set({ tenantId, status: 'loading', error: null });
    try {
      const config = await fetchPublicBranding(tenantId);
      applyBrandingConfig(config);
      set({ config, status: 'ready' });
    } catch (e) {
      applyBrandingConfig({
        tenant_id: tenantId,
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
        welcome_text: 'Social2Game',
      });
      set({
        status: 'error',
        error: e instanceof Error ? e.message : 'No se pudo cargar branding',
      });
    }
  },
}));
