import { useCallback, useEffect } from 'react';

import { useToast } from './useToast';
import { useNotificationsStore, selectUnreadNotificationCount } from '../store/notificationsStore';
import { usePlayerStore } from '../store/playerStore';
import { useModalsStore } from '../store/modalsStore';

const POLL_INTERVAL_MS = 30_000;
export const NOTIFICATIONS_AUTO_MARK_DELAY_MS = 1_500;

export function usePlayerNotificationsSync() {
  const refresh = useNotificationsStore((state) => state.refresh);
  const unreadCount = useNotificationsStore(selectUnreadNotificationCount);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), POLL_INTERVAL_MS);
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    updatePlayer({ unreadNotifications: unreadCount });
  }, [unreadCount, updatePlayer]);
}

export function usePlayerNotificationsPanel() {
  const toast = useToast();
  const notifications = useNotificationsStore((state) => state.notifications);
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const error = useNotificationsStore((state) => state.error);
  const refresh = useNotificationsStore((state) => state.refresh);
  const markOpenedStore = useNotificationsStore((state) => state.markOpened);
  const markAllSeenStore = useNotificationsStore((state) => state.markAllSeen);
  const unreadCount = useNotificationsStore(selectUnreadNotificationCount);

  const markOpened = useCallback(
    async (id: string) => {
      try {
        await markOpenedStore(id);
      } catch (reason) {
        toast.danger(reason instanceof Error ? reason.message : 'No pudimos marcar como leída');
      }
    },
    [markOpenedStore, toast],
  );

  const markAllSeen = useCallback(
    async (ids?: string[]) => {
      try {
        await markAllSeenStore(ids);
      } catch (reason) {
        toast.danger(reason instanceof Error ? reason.message : 'No pudimos marcar todas como leídas');
      }
    },
    [markAllSeenStore, toast],
  );

  return { notifications, isLoading, error, refresh, markOpened, markAllSeen, unreadCount };
}

/** Debounced bulk-mark when panel stays open — lets badge stay visible briefly. */
export function useAutoMarkNotificationsOnPanelOpen(isOpen: boolean) {
  const refresh = useNotificationsStore((state) => state.refresh);
  const markAllSeenStore = useNotificationsStore((state) => state.markAllSeen);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let debounceTimer: number | undefined;

    void (async () => {
      await refresh();
      if (cancelled) return;

      debounceTimer = window.setTimeout(() => {
        if (cancelled || useModalsStore.getState().activeModal !== 'notifications') return;

        const unreadIds = useNotificationsStore
          .getState()
          .notifications.filter((notification) => !notification.opened)
          .map((notification) => notification.id);

        if (unreadIds.length === 0) return;

        void markAllSeenStore(unreadIds).catch((reason) => {
          toast.danger(reason instanceof Error ? reason.message : 'No pudimos marcar como leídas');
        });
      }, NOTIFICATIONS_AUTO_MARK_DELAY_MS);
    })();

    return () => {
      cancelled = true;
      if (debounceTimer !== undefined) window.clearTimeout(debounceTimer);
    };
  }, [isOpen, refresh, markAllSeenStore, toast]);
}
