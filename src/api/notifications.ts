import { getJson, postJson } from './fetchJson';
import { unwrapNotificationRows } from '../lib/normalizeNotification';
import type { PlayerInAppNotification } from '../types/notifications';

export async function getPlayerNotifications(): Promise<PlayerInAppNotification[]> {
  const data = await getJson<unknown>('/v1/player/notifications');
  return unwrapNotificationRows(data);
}

export async function openPlayerNotification(id: string): Promise<void> {
  await postJson<{ ok: boolean }>(`/v1/player/notifications/${encodeURIComponent(id)}/open`);
}

export async function bulkMarkNotificationsSeen(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await postJson<{ ok: boolean }>('/v1/player/notifications/bulk-mark-seen', { ids });
}

/** @deprecated use getPlayerNotifications */
export async function fetchNotifications(): Promise<PlayerInAppNotification[]> {
  return getPlayerNotifications();
}
