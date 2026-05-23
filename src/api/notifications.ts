import { apiClient } from './client';
import type { AppNotification } from '../types/social';

export async function fetchNotifications(): Promise<AppNotification[]> {
  return apiClient.get('/v1/player/notifications').then((response) => response.data as AppNotification[]);
}
