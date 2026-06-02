import { format, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

export function parseSafeDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function safeFormatDate(
  value: string | Date | null | undefined,
  formatStr: string,
  fallback = '—',
): string {
  const date = parseSafeDate(value);
  if (!date) return fallback;
  try {
    return format(date, formatStr, { locale: es });
  } catch {
    return fallback;
  }
}

export function safeFormatRelativeTime(
  value: string | Date | null | undefined,
  fallback = '—',
): string {
  const date = parseSafeDate(value);
  if (!date) return fallback;
  try {
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: es });
  } catch {
    return fallback;
  }
}

export function safeFormatDistanceToNow(
  value: string | Date | null | undefined,
  options?: { addSuffix?: boolean },
  fallback = '—',
): string {
  const date = parseSafeDate(value);
  if (!date) return fallback;
  try {
    return formatDistanceToNow(date, { ...options, locale: es });
  } catch {
    return fallback;
  }
}

export function safeFormatTimeRemaining(
  value: string | Date | null | undefined,
  fallback = '',
): string {
  const date = parseSafeDate(value);
  if (!date) return fallback;
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return 'terminó';
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} ${days === 1 ? 'día' : 'días'}`;
  if (hours >= 1) return `${hours}h ${minutes % 60}m`;
  return `${Math.max(1, minutes)}m`;
}

export function safeFormatTimeDelta(
  value: string | Date | null | undefined,
  now: Date = new Date(),
): string | undefined {
  const date = parseSafeDate(value);
  if (!date) return undefined;
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'cerrado';
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/** Etiqueta legible para expiración de inventario (cofres, ruedas). */
export function formatExpiryLabel(
  value: string | Date | null | undefined,
  fallback = 'Sin expiración',
): string {
  const date = parseSafeDate(value);
  if (!date) return fallback;
  return safeFormatDate(date, 'd MMM HH:mm', fallback);
}
