import { create } from 'zustand';

import {
  bulkMarkNotificationsSeen,
  getPlayerNotifications,
  openPlayerNotification,
} from '../api/notifications';
import type { PlayerInAppNotification } from '../types/notifications';

function toError(reason: unknown, fallback: string): Error {
  return reason instanceof Error ? reason : new Error(fallback);
}

export interface NotificationsState {
  notifications: PlayerInAppNotification[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  markOpened: (id: string) => Promise<void>;
  markAllSeen: (ids?: string[]) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  refresh: async () => {
    set({ isLoading: true });
    try {
      const rows = await getPlayerNotifications();
      set({ notifications: rows, error: null, isLoading: false });
    } catch (reason) {
      set({
        error: toError(reason, 'No pudimos cargar tus notificaciones'),
        isLoading: false,
      });
    }
  },
  markOpened: async (id: string) => {
    const snapshot = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, opened: true } : notification,
      ),
    }));
    try {
      await openPlayerNotification(id);
    } catch (reason) {
      set({ notifications: snapshot });
      throw toError(reason, 'No pudimos marcar la notificación como leída');
    }
  },
  markAllSeen: async (ids?: string[]) => {
    const unreadIds =
      ids ??
      get()
        .notifications.filter((notification) => !notification.opened)
        .map((notification) => notification.id);
    if (unreadIds.length === 0) return;

    const snapshot = get().notifications;
    const idSet = new Set(unreadIds);
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        idSet.has(notification.id) ? { ...notification, opened: true } : notification,
      ),
    }));
    try {
      await bulkMarkNotificationsSeen(unreadIds);
    } catch (reason) {
      set({ notifications: snapshot });
      throw toError(reason, 'No pudimos marcar las notificaciones como leídas');
    }
  },
}));

export function selectUnreadNotificationCount(state: NotificationsState): number {
  return state.notifications.filter((notification) => !notification.opened).length;
}
