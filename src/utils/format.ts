import {
  parseSafeDate,
  safeFormatDate,
  safeFormatRelativeTime,
  safeFormatTimeRemaining,
} from './date';

/** Hora local HH:mm para fin de multiplicador del operador. */
export const formatBoostEndClock = (iso: string | null | undefined): string =>
  safeFormatDate(iso, 'HH:mm', '—');

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es-AR').format(value);

export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('es-AR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value);

export const formatRelativeTime = (date: string | null | undefined): string =>
  safeFormatRelativeTime(date);

export const formatRelativeShort = (date?: string | null): string =>
  date && parseSafeDate(date) ? safeFormatRelativeTime(date) : 'vence pronto';

export const formatTimeRemaining = (date?: string | null): string =>
  safeFormatTimeRemaining(date);

export const getProgressPercent = (value: number, max: number): number =>
  max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

export { safeFormatDate, formatExpiryLabel, parseSafeDate } from './date';
