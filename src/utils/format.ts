import { format, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

/** Hora local HH:mm para fin de multiplicador del operador. */
export const formatBoostEndClock = (iso: string): string => format(new Date(iso), 'HH:mm');

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

export const formatRelativeTime = (date: string): string =>
  formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: es,
  });

export const formatRelativeShort = (date?: string): string => (date ? formatRelativeTime(date) : 'vence pronto');

export const formatTimeRemaining = (date?: string | null): string => {
  if (!date) return '';
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return 'terminó';
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} ${days === 1 ? 'día' : 'días'}`;
  if (hours >= 1) return `${hours}h ${minutes % 60}m`;
  return `${Math.max(1, minutes)}m`;
};

export const getProgressPercent = (value: number, max: number): number =>
  max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
