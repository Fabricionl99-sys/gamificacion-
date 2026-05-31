import {
  RADIUS_BY_SCALE,
  resolvePublicBrandingConfig,
} from './brandingDefaults';
import type { PublicBrandingConfig } from '../types/branding';

/**
 * TODAS las CSS vars que applyOperatorBranding setea. Importante mantener
 * en sync con la función — clearOperatorBranding las remueve.
 */
const OVERRIDE_VARS = [
  // Aliases BO palette (task #138)
  '--color-primary',
  '--color-secondary',
  '--color-accent',
  '--color-background',
  '--color-text',
  // Accents
  '--accent-primary',
  '--accent-hover',
  '--accent-active',
  '--accent-glow',
  '--accent-subtle',
  '--accent-text',
  '--text-on-accent',
  '--border-accent',
  '--border-accent-strong',
  '--app-accent-wash',
  '--scan-accent',
  '--glow-accent',
  '--glow-accent-strong',
  '--glow-accent-intense',
  // Backgrounds
  '--bg-primary',
  '--bg-secondary',
  '--bg-tertiary',
  '--bg-elevated',
  '--bg-overlay',
  '--glass-surface',
  '--avatar-surface-glow',
  // Texts
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--text-disabled',
  // Borders
  '--border-subtle',
  '--border-default',
  '--border-strong',
  // Tipografía
  '--font-family',
  '--font-size-base',
  '--font-weight-heading',
  '--font-weight-body',
  '--font-heading-family',
  '--profile-card-bg',
  '--progress-fill',
  '--progress-track',
  '--color-success',
  '--color-warning',
  '--color-danger',
  '--badge-color',
  '--chest-common',
  '--chest-rare',
  '--chest-epic',
  '--chest-legendary',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
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
/** MANTENER SYNC con BRANDING_FONTS del backend (branding.schema.ts). Arial = system font. */
const GOOGLE_FONT_URLS: Record<string, string> = {
  Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  Urbanist: 'https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap',
  Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
  Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
  Lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap',
  Raleway: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap',
  Nunito: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',
  Oswald: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap',
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
  delete root.dataset.animations;
}

export function applyOperatorBranding(config: PublicBrandingConfig): void {
  const resolved = resolvePublicBrandingConfig(config);
  const c = resolved.color_palette;
  const root = document.documentElement;
  const brandColor = c.primary_color || c.accent_color;
  const accentColor = c.accent_color || c.primary_color;
  const accentRgb = hexToRgb(accentColor);
  const bgRgb = hexToRgb(c.background_color);
  const textRgb = hexToRgb(c.text_color);

  root.style.setProperty('--color-primary', c.primary_color);
  root.style.setProperty('--color-secondary', c.secondary_color);
  root.style.setProperty('--color-accent', accentColor);
  root.style.setProperty('--color-background', c.background_color);
  root.style.setProperty('--color-text', c.text_color);

  // ─── Accents (primary_color drives the main brand surface) ───────
  root.style.setProperty('--accent-primary', brandColor);
  root.style.setProperty('--accent-hover', darken(brandColor, 0.1));
  root.style.setProperty('--accent-active', darken(brandColor, 0.2));
  root.style.setProperty('--border-accent-strong', brandColor);
  const accentTextColor = isLight(brandColor) ? '#0A0E13' : '#FFFFFF';
  root.style.setProperty('--accent-text', accentTextColor);
  root.style.setProperty('--text-on-accent', accentTextColor);
  if (accentRgb) {
    const a = `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`;
    root.style.setProperty('--accent-glow', `rgba(${a}, 0.35)`);
    root.style.setProperty('--accent-subtle', `rgba(${a}, 0.10)`);
    root.style.setProperty('--border-accent', `rgba(${a}, 0.35)`);
    root.style.setProperty('--app-accent-wash', `rgba(${a}, 0.08)`);
    root.style.setProperty('--scan-accent', `rgba(${a}, 0.05)`);
    root.style.setProperty('--glow-accent', `0 0 20px rgba(${a}, 0.3)`);
    root.style.setProperty('--glow-accent-strong', `0 0 32px rgba(${a}, 0.5)`);
    root.style.setProperty('--glow-accent-intense', `0 0 48px rgba(${a}, 0.7)`);
  }

  // ─── Backgrounds (deriva 3 tonos a partir de los 2 que el operador da) ──
  root.style.setProperty('--bg-primary', c.background_color);
  root.style.setProperty('--bg-secondary', c.secondary_color);
  // tertiary = secondary aclarado un poco (cards encima de secondary)
  root.style.setProperty('--bg-tertiary', lighten(c.secondary_color, 0.05));
  // elevated = bg más alto para modales/popovers
  root.style.setProperty('--bg-elevated', lighten(c.secondary_color, 0.08));
  if (bgRgb) {
    const b = `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`;
    root.style.setProperty('--bg-overlay', `rgba(${b}, 0.85)`);
  }
  // Glass surface = semi-transparent tertiary
  const secondaryRgb = hexToRgb(c.secondary_color);
  if (secondaryRgb) {
    const s = `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`;
    root.style.setProperty('--glass-surface', `rgba(${s}, 0.6)`);
    root.style.setProperty('--avatar-surface-glow', `rgba(${s}, 0.9)`);
  }

  // ─── Texts (operador puede override text_secondary vía branding) ──
  root.style.setProperty('--text-primary', c.text_color);
  root.style.setProperty('--text-secondary', resolved.text_secondary_color);
  root.style.setProperty('--text-tertiary', withAlpha(c.text_color, 0.42));
  root.style.setProperty('--text-disabled', withAlpha(c.text_color, 0.24));

  // ─── Borders ──────────────────────────────────────────────────────
  root.style.setProperty('--border-subtle', withAlpha(resolved.border_color, 0.5));
  root.style.setProperty('--border-default', resolved.border_color);
  root.style.setProperty('--border-strong', withAlpha(c.text_color, 0.2));
  if (textRgb) {
    const t = `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`;
    if (!resolved.border_color) {
      root.style.setProperty('--border-subtle', `rgba(${t}, 0.06)`);
      root.style.setProperty('--border-default', `rgba(${t}, 0.10)`);
    }
  }

  // ─── Extended tokens (granular colors + cofres) ───────────────────
  root.style.setProperty('--profile-card-bg', resolved.profile_card_color);
  root.style.setProperty('--progress-fill', resolved.progress_bar_fill_color);
  root.style.setProperty('--progress-track', resolved.progress_bar_track_color);
  root.style.setProperty('--color-success', resolved.success_color);
  root.style.setProperty('--color-warning', resolved.warning_color);
  root.style.setProperty('--color-danger', resolved.error_color);
  root.style.setProperty('--badge-color', resolved.badge_color);
  root.style.setProperty('--chest-common', resolved.chest_rarity_common_color);
  root.style.setProperty('--chest-rare', resolved.chest_rarity_rare_color);
  root.style.setProperty('--chest-epic', resolved.chest_rarity_epic_color);
  root.style.setProperty('--chest-legendary', resolved.chest_rarity_legendary_color);

  const radii = RADIUS_BY_SCALE[resolved.border_radius_scale ?? 'rounded'];
  root.style.setProperty('--radius-sm', radii.sm);
  root.style.setProperty('--radius-md', radii.md);
  root.style.setProperty('--radius-lg', radii.lg);
  root.style.setProperty('--radius-xl', radii.xl);

  // ─── Tipografía (Sub-etapa Operator-Branding-v2) ────────────────
  const t = resolved.typography;
  const headingFont = t.heading_font_family ?? t.font_family;
  if (t?.font_family) {
    loadFontStylesheet(t.font_family);
    const fallback = t.font_family === 'Arial' ? 'sans-serif' : `'${t.font_family}', system-ui, sans-serif`;
    root.style.setProperty('--font-family', fallback);
  }
  if (headingFont) {
    loadFontStylesheet(headingFont);
    const headingFallback =
      headingFont === 'Arial' ? 'sans-serif' : `'${headingFont}', system-ui, sans-serif`;
    root.style.setProperty('--font-heading-family', headingFallback);
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
  if (resolved.theme_mode) {
    if (resolved.theme_mode === 'auto') {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      root.dataset.theme = prefersLight ? 'light' : 'dark';
    } else {
      root.dataset.theme = resolved.theme_mode;
    }
  }

  root.dataset.animations = resolved.animations_intensity ?? 'subtle';

  // ─── Background image custom ─────────────────────────────────────
  if (resolved.background_image_url) {
    root.style.setProperty(
      'background-image',
      `url(${resolved.background_image_url}), radial-gradient(circle at 15% 0%, var(--accent-subtle), transparent 28rem), var(--bg-primary)`,
    );
  }

  if (resolved.custom_css?.trim()) {
    if (!customStyleEl) {
      customStyleEl = document.createElement('style');
      customStyleEl.setAttribute('data-branding-custom', 'true');
      document.head.appendChild(customStyleEl);
    }
    customStyleEl.textContent = resolved.custom_css;
  }

  if (resolved.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = resolved.favicon_url;
  }

  root.dataset.brandingTenant = resolved.tenant_id;
  root.dataset.levelLabel = resolved.level_label ?? 'Nivel';
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

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Luminosidad percibida (WCAG simplified). True si el color es claro (texto
 * oscuro lee mejor encima), false si es oscuro (texto claro lee mejor).
 */
function isLight(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Fórmula HSP perceived brightness — funciona bien para contraste de texto.
  const brightness = Math.sqrt(
    0.299 * rgb.r * rgb.r + 0.587 * rgb.g * rgb.g + 0.114 * rgb.b * rgb.b,
  );
  return brightness > 130; // ~0.51 normalizado
}

/** Oscurece un color hex en proporción (0-1). Útil para hover states. */
function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - amount;
  return rgbToHex(
    Math.max(0, Math.round(rgb.r * factor)),
    Math.max(0, Math.round(rgb.g * factor)),
    Math.max(0, Math.round(rgb.b * factor)),
  );
}

/** Aclara un color hex en proporción (0-1). Útil para derivar bg-tertiary. */
function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(
    Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)),
    Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)),
    Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount)),
  );
}
