import type { PublicBrandingConfig } from '../types/branding';

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
  '--font-family',
  '--font-size-base',
  '--font-weight-heading',
  '--font-weight-body',
] as const;

/** Mapping de font_size_base categórico → píxeles base del widget. */
const FONT_SIZE_PX: Record<string, string> = {
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
};

/**
 * URLs Google Fonts por familia. Arial no se carga (system font). Si una font
 * no está acá, se asume system / NOT load. Cada URL ya pide los pesos comunes
 * (400/500/600/700) para que el operator no rompa cuando elija pesos no-cargados.
 */
const GOOGLE_FONT_URLS: Record<string, string> = {
  Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  Nunito: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',
  Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
  Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap',
};

let customStyleEl: HTMLStyleElement | null = null;
const loadedFonts = new Set<string>();

/**
 * Carga lazy del CSS de Google Fonts. Dedupe — si ya está cargado, no-op.
 * Inserta un <link rel="stylesheet"> en <head> por familia. No bloquea el render
 * del widget (display=swap) — primero se ve la system font, después se aplica
 * cuando termina de descargar.
 */
function loadFontStylesheet(fontFamily: string): void {
  if (fontFamily === 'Arial' || !fontFamily) return;
  if (loadedFonts.has(fontFamily)) return;
  const url = GOOGLE_FONT_URLS[fontFamily];
  if (!url) return; // font no soportada → fallback system
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute('data-branding-font', fontFamily);
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}

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
  delete root.dataset.theme;
}

export function applyOperatorBranding(config: PublicBrandingConfig): void {
  const c = config.color_palette;
  const root = document.documentElement;
  const rgb = hexToRgb(c.accent_color);

  // ─── Colores ─────────────────────────────────────────────────────
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

  // ─── Tipografía (Sub-etapa Operator-Branding-v2) ────────────────
  const t = config.typography;
  if (t?.font_family) {
    loadFontStylesheet(t.font_family);
    const fallback = t.font_family === 'Arial' ? 'sans-serif' : `'${t.font_family}', system-ui, sans-serif`;
    root.style.setProperty('--font-family', fallback);
  }
  if (t?.font_size_base) {
    const px = FONT_SIZE_PX[t.font_size_base] ?? FONT_SIZE_PX.md;
    root.style.setProperty('--font-size-base', px);
  }
  if (t?.heading_weight) {
    root.style.setProperty('--font-weight-heading', t.heading_weight);
  }
  if (t?.body_weight) {
    root.style.setProperty('--font-weight-body', t.body_weight);
  }

  // ─── Theme mode (light | dark | auto) ────────────────────────────
  if (config.theme_mode) {
    if (config.theme_mode === 'auto') {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      root.dataset.theme = prefersLight ? 'light' : 'dark';
    } else {
      root.dataset.theme = config.theme_mode;
    }
  }

  // ─── Background image custom ─────────────────────────────────────
  if (config.background_image_url) {
    root.style.setProperty(
      'background-image',
      `url(${config.background_image_url}), radial-gradient(circle at 20% 0%, var(--accent-subtle), transparent 28rem), var(--bg-primary)`,
    );
  }

  // ─── Custom CSS (futuro — hoy backend no lo expone vía public-branding) ──
  if (config.custom_css?.trim()) {
    if (!customStyleEl) {
      customStyleEl = document.createElement('style');
      customStyleEl.setAttribute('data-branding-custom', 'true');
      document.head.appendChild(customStyleEl);
    }
    customStyleEl.textContent = config.custom_css;
  }

  // ─── Favicon ──────────────────────────────────────────────────────
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

/**
 * Sprint #6 fix: ANTES había un guard `if (isDefaultTenant) clearOperatorBranding()`
 * que evitaba aplicar el branding cuando el tenant era DemoPlay (el default).
 * La intención original era "DemoPlay nunca cambia, mostralo con defaults
 * del widget".
 *
 * El problema: el founder (DemoPlay actualmente) edita su branding desde el
 * BO y necesita ver los cambios. Sacamos el guard — aplicamos branding
 * SIEMPRE que el endpoint público devuelva config válida. Si el operador
 * no editó nada, igual el backend devuelve defaults sanos.
 */
export function applyBrandingConfig(config: PublicBrandingConfig): void {
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
