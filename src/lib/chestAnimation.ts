/** Timeline de apertura del cofre (ms). */
export const CHEST_OPEN_TIMELINE_MS = {
  /** Vibración inicial — 1 a 1.5 s */
  shake: 1250,
  lockBreak: 400,
  lidOpen: 650,
} as const;

export type ChestOpenPhase =
  | 'closed'
  | 'shake'
  | 'lockBreak'
  | 'open'
  | 'ready'
  | 'spinning'
  | 'result';
