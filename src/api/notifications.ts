import { mockNotifications } from '../mocks';
import type { AppNotification } from '../types/social';

export async function fetchNotifications(): Promise<AppNotification[]> {
  return mockNotifications;
}
