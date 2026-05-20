import type { PublicBrandingConfig } from '../types/branding';
import { isDefaultTenant } from './demoTenant';

const OVERRIDE_VARS = [
  '--accent-primary',
  '--accent-hover',
  '--accent-active',
  '--accent-glow',
  '--accent-subtle',
  '--border-accent',
  '--border-accent-strong',
  '--bg-primary',
  '--bg-secondary',
  '--text-primary',
  '--text-secondary',
] as const;

let customStyleEl: HTMLStyleElement | null = null;

export function clearOperatorBranding(): void {
  const root = document.documentElement;
  for (const key of OVERRIDE_VARS) {
    root.style.removeProperty(key);
  }
  root.style.removeProperty('background-image');
  if (customStyleEl) {
    customStyleEl.remove();
    customStyleEl = null;
  }
  delete root.dataset.brandingTenant;
}

export function applyOperatorBranding(config: PublicBrandingConfig): void {
  const c = config.color_palette;
  const root = document.documentElement;
  const rgb = hexToRgb(c.accent_color);

  root.style.setProperty('--accent-primary', c.accent_color);
  root.style.setProperty('--accent-hover', c.accent_color);
  root.style.setProperty('--accent-active', c.accent_color);
  root.style.setProperty('--border-accent-strong', c.accent_color);
  if (rgb) {
    root.style.setProperty('--accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
    root.style.setProperty('--accent-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    root.style.setProperty('--border-accent', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
  }
  root.style.setProperty('--bg-primary', c.background_color);
  root.style.setProperty('--bg-secondary', c.secondary_color);
  root.style.setProperty('--text-primary', c.text_color);
  root.style.setProperty('--text-secondary', withAlpha(c.text_color, 0.72));

  if (config.background_image_url) {
    root.style.setProperty(
      'background-image',
      `url(${config.background_image_url}), radial-gradient(circle at 20% 0%, var(--accent-subtle), transparent 28rem), var(--bg-primary)`,
    );
  }

  if (config.custom_css?.trim()) {
    if (!customStyleEl) {
      customStyleEl = document.createElement('style');
      customStyleEl.setAttribute('data-branding-custom', 'true');
      document.head.appendChild(customStyleEl);
    }
    customStyleEl.textContent = config.custom_css;
  }

  if (config.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = config.favicon_url;
  }

  root.dataset.brandingTenant = config.tenant_id;
}

export function applyBrandingConfig(config: PublicBrandingConfig): void {
  if (isDefaultTenant(config.tenant_id)) {
    clearOperatorBranding();
    return;
  }
  applyOperatorBranding(config);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = hex.replace('#', '');
  if (n.length !== 6) return null;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
