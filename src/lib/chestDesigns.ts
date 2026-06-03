/** Skins de cofre elegibles por el operador (BO → player inventory). */
export const CHEST_VISUAL_STYLES = ['neon', 'quantum', 'obsidian', 'holo', 'plasma'] as const;

export type ChestVisualStyle = (typeof CHEST_VISUAL_STYLES)[number];

/** Paleta para el cofre SVG — sin clases Tailwind dinámicas. */
export interface ChestDesignTokens {
  id: ChestVisualStyle;
  label: string;
  /** Marco metálico dorado / bronce */
  frame: string;
  frameHighlight: string;
  frameShadow: string;
  /** Panel principal (cristal o madera) */
  panelTop: string;
  panelBottom: string;
  panelStroke: string;
  /** Variante holo usa madera en lugar de cristal */
  panelMode: 'crystal' | 'wood';
  woodGrain?: string;
  /** Brillo interno y ambient */
  glow: string;
  glowStrong: string;
  lockGem: string;
  lockRing: string;
  accent: string;
}

export const CHEST_DESIGNS: Record<ChestVisualStyle, ChestDesignTokens> = {
  neon: {
    id: 'neon',
    label: 'Neón',
    frame: '#C9A227',
    frameHighlight: '#FFE566',
    frameShadow: '#7A5A12',
    panelTop: '#22D3EE',
    panelBottom: '#059669',
    panelStroke: '#67E8F9',
    panelMode: 'crystal',
    glow: 'rgba(34,211,238,0.45)',
    glowStrong: 'rgba(16,185,129,0.65)',
    lockGem: '#22D3EE',
    lockRing: '#FFD700',
    accent: '#22d3ee',
  },
  quantum: {
    id: 'quantum',
    label: 'Quantum',
    frame: '#D4AF37',
    frameHighlight: '#FFF0A0',
    frameShadow: '#8B6914',
    panelTop: '#38BDF8',
    panelBottom: '#7C3AED',
    panelStroke: '#BAE6FD',
    panelMode: 'crystal',
    glow: 'rgba(56,189,248,0.5)',
    glowStrong: 'rgba(124,58,237,0.55)',
    lockGem: '#60A5FA',
    lockRing: '#FDE68A',
    accent: '#a78bfa',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Obsidiana',
    frame: '#B8860B',
    frameHighlight: '#FFD700',
    frameShadow: '#5C4A0E',
    panelTop: '#1C1917',
    panelBottom: '#44403C',
    panelStroke: '#FBBF24',
    panelMode: 'crystal',
    glow: 'rgba(251,191,36,0.35)',
    glowStrong: 'rgba(245,158,11,0.45)',
    lockGem: '#FCD34D',
    lockRing: '#D97706',
    accent: '#fbbf24',
  },
  holo: {
    id: 'holo',
    label: 'Holográfico',
    frame: '#C9A227',
    frameHighlight: '#FFE08A',
    frameShadow: '#7A5A12',
    panelTop: '#14B8A6',
    panelBottom: '#0F766E',
    panelStroke: '#5EEAD4',
    panelMode: 'wood',
    woodGrain: '#115E59',
    glow: 'rgba(20,184,166,0.38)',
    glowStrong: 'rgba(94,234,212,0.42)',
    lockGem: '#2DD4BF',
    lockRing: '#FFD700',
    accent: '#7dd3fc',
  },
  plasma: {
    id: 'plasma',
    label: 'Plasma',
    frame: '#E07A2D',
    frameHighlight: '#FFB366',
    frameShadow: '#9A3412',
    panelTop: '#FB923C',
    panelBottom: '#E11D48',
    panelStroke: '#FDBA74',
    panelMode: 'crystal',
    glow: 'rgba(251,146,60,0.48)',
    glowStrong: 'rgba(225,29,72,0.5)',
    lockGem: '#FB7185',
    lockRing: '#F97316',
    accent: '#fb923c',
  },
};

export function resolveChestVisualStyle(raw?: string | null): ChestVisualStyle {
  if (raw && CHEST_VISUAL_STYLES.includes(raw as ChestVisualStyle)) {
    return raw as ChestVisualStyle;
  }
  return 'neon';
}

export function getChestDesign(style?: string | null): ChestDesignTokens {
  return CHEST_DESIGNS[resolveChestVisualStyle(style)];
}
