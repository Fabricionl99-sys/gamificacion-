import type { PublicBrandingConfig } from '../types/branding';

export const BRANDING_PREVIEW_MESSAGE_TYPE = 's2g:branding-preview' as const;

export type BrandingPreviewMessage = {
  type: typeof BRANDING_PREVIEW_MESSAGE_TYPE;
  config: PublicBrandingConfig;
};

export function isBrandingPreviewMessage(data: unknown): data is BrandingPreviewMessage {
  if (typeof data !== 'object' || data === null) return false;
  const msg = data as Record<string, unknown>;
  return msg.type === BRANDING_PREVIEW_MESSAGE_TYPE && typeof msg.config === 'object' && msg.config !== null;
}

export function isBrandingPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('preview') === '1' || params.get('embed') === 'bo-preview';
}
