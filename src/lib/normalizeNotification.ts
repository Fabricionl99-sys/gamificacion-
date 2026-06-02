import type { PlayerInAppNotification } from '../types/notifications';

export function normalizePlayerNotification(raw: Record<string, unknown>): PlayerInAppNotification {
  return {
    id: String(raw.id ?? ''),
    trigger_event: String(raw.trigger_event ?? raw.kind ?? 'system'),
    title: String(raw.title ?? 'Notificación'),
    body: String(raw.body ?? raw.detail ?? ''),
    icon: typeof raw.icon === 'string' && raw.icon.trim() ? raw.icon : null,
    cta_label: typeof raw.cta_label === 'string' ? raw.cta_label : null,
    cta_url: typeof raw.cta_url === 'string' ? raw.cta_url : null,
    image_url: typeof raw.image_url === 'string' ? raw.image_url : null,
    created_at: String(raw.created_at ?? raw.createdAt ?? ''),
    opened:
      raw.opened === true ||
      raw.read === true ||
      raw.seen === true ||
      Boolean(raw.opened_at) ||
      Boolean(raw.seen_at),
  };
}

export function unwrapNotificationRows(data: unknown): PlayerInAppNotification[] {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { items?: unknown[] }).items)
      ? (data as { items: unknown[] }).items
      : [];
  return rows
    .map((row) => normalizePlayerNotification(row as Record<string, unknown>))
    .filter((row) => row.id.length > 0);
}
