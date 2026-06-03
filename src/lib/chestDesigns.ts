/** Skins de cofre elegibles por el operador (BO → player inventory). */
export const CHEST_VISUAL_STYLES = ['neon', 'quantum', 'obsidian', 'holo', 'plasma'] as const;

export type ChestVisualStyle = (typeof CHEST_VISUAL_STYLES)[number];

export interface ChestDesignTokens {
  id: ChestVisualStyle;
  label: string;
  body: string;
  lid: string;
  trim: string;
  glow: string;
  lock: string;
  inner: string;
  accent: string;
}

export const CHEST_DESIGNS: Record<ChestVisualStyle, ChestDesignTokens> = {
  neon: {
    id: 'neon',
    label: 'Neón',
    body: 'from-slate-950 via-slate-900 to-emerald-950',
    lid: 'from-emerald-400/90 via-cyan-500/80 to-emerald-600/90',
    trim: 'border-cyan-400/70 shadow-[0_0_24px_rgba(34,211,238,0.45)]',
    glow: 'rgba(34,211,238,0.35)',
    lock: 'text-cyan-300',
    inner: 'from-cyan-500/20 to-emerald-500/10',
    accent: '#22d3ee',
  },
  quantum: {
    id: 'quantum',
    label: 'Quantum',
    body: 'from-indigo-950 via-violet-950 to-slate-950',
    lid: 'from-violet-400/90 via-fuchsia-500/75 to-indigo-600/90',
    trim: 'border-violet-400/60 shadow-[0_0_28px_rgba(167,139,250,0.4)]',
    glow: 'rgba(167,139,250,0.38)',
    lock: 'text-violet-200',
    inner: 'from-violet-500/25 to-fuchsia-500/10',
    accent: '#a78bfa',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Obsidiana',
    body: 'from-zinc-950 via-neutral-900 to-stone-950',
    lid: 'from-amber-500/85 via-yellow-600/70 to-amber-700/90',
    trim: 'border-amber-400/55 shadow-[0_0_22px_rgba(251,191,36,0.35)]',
    glow: 'rgba(251,191,36,0.28)',
    lock: 'text-amber-200',
    inner: 'from-amber-500/15 to-yellow-600/10',
    accent: '#fbbf24',
  },
  holo: {
    id: 'holo',
    label: 'Holográfico',
    body: 'from-slate-900 via-slate-800 to-sky-950',
    lid: 'from-sky-300/80 via-teal-300/70 to-pink-400/75',
    trim: 'border-sky-300/50 shadow-[0_0_26px_rgba(125,211,252,0.35)]',
    glow: 'rgba(125,211,252,0.32)',
    lock: 'text-sky-200',
    inner: 'from-sky-400/20 via-teal-400/15 to-pink-400/15',
    accent: '#7dd3fc',
  },
  plasma: {
    id: 'plasma',
    label: 'Plasma',
    body: 'from-rose-950 via-orange-950 to-slate-950',
    lid: 'from-orange-400/90 via-rose-500/80 to-red-600/85',
    trim: 'border-orange-400/60 shadow-[0_0_30px_rgba(251,146,60,0.42)]',
    glow: 'rgba(251,146,60,0.36)',
    lock: 'text-orange-200',
    inner: 'from-orange-500/22 to-rose-600/12',
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
