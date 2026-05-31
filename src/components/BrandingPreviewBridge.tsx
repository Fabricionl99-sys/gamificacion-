import { useEffect } from 'react';

import { applyBrandingConfig } from '../lib/applyBranding';
import { isBrandingPreviewMessage, isBrandingPreviewMode } from '../lib/brandingPreviewProtocol';
import { useBrandingStore } from '../store/brandingStore';

/** Escucha postMessage del BO para preview live antes de guardar. */
export function BrandingPreviewBridge() {
  const previewMode = isBrandingPreviewMode();

  useEffect(() => {
    if (!previewMode) return;

    const onMessage = (event: MessageEvent) => {
      if (!isBrandingPreviewMessage(event.data)) return;
      applyBrandingConfig(event.data.config);
      useBrandingStore.setState({ config: event.data.config, status: 'ready' });
    };

    window.addEventListener('message', onMessage);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 's2g:branding-preview-ready' }, '*');
    }
    return () => window.removeEventListener('message', onMessage);
  }, [previewMode]);

  return null;
}
