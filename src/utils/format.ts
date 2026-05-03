import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

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

export const getProgressPercent = (value: number, max: number): number =>
  max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
