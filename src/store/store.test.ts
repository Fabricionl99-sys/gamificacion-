import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useModalsStore } from './modalsStore';
import { useNotificationsStore } from './notificationsStore';
import { usePlayerStore } from './playerStore';
import { useUiStore } from './uiStore';
import * as notificationsApi from '../api/notifications';

describe('stores', () => {
  beforeEach(() => {
    useNotificationsStore.setState({
      notifications: [],
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('opens and closes modals', () => {
    useModalsStore.getState().openModal('levelUp');
    expect(useModalsStore.getState().activeModal).toBe('levelUp');
    useModalsStore.getState().closeModal();
    expect(useModalsStore.getState().activeModal).toBeNull();
  });

  it('switches tabs and returns to widget view', () => {
    useUiStore.getState().setActiveView('own-profile');
    useUiStore.getState().setActiveTab('ranking');
    expect(useUiStore.getState().activeTab).toBe('ranking');
    expect(useUiStore.getState().activeView).toBe('widget');
  });

  it('claims pending prizes without going below zero', () => {
    const before = usePlayerStore.getState().player.pendingPrizes;
    usePlayerStore.getState().claimPrize();
    expect(usePlayerStore.getState().player.pendingPrizes).toBe(Math.max(0, before - 1));
  });

  it('marks all notifications as seen', async () => {
    vi.spyOn(notificationsApi, 'bulkMarkNotificationsSeen').mockResolvedValue(undefined);
    useNotificationsStore.setState({
      notifications: [
        {
          id: 'n1',
          trigger_event: 'manual',
          title: 'Test',
          body: 'Body',
          icon: null,
          cta_label: null,
          cta_url: null,
          image_url: null,
          created_at: new Date().toISOString(),
          opened: false,
        },
      ],
      error: null,
      isLoading: false,
    });
    await useNotificationsStore.getState().markAllSeen();
    expect(useNotificationsStore.getState().notifications.every((n) => n.opened)).toBe(true);
  });

  it('rolls back markOpened when API fails', async () => {
    vi.spyOn(notificationsApi, 'openPlayerNotification').mockRejectedValue(new Error('network'));
    useNotificationsStore.setState({
      notifications: [
        {
          id: 'n1',
          trigger_event: 'manual',
          title: 'Test',
          body: 'Body',
          icon: null,
          cta_label: null,
          cta_url: null,
          image_url: null,
          created_at: new Date().toISOString(),
          opened: false,
        },
      ],
      error: null,
      isLoading: false,
    });
    await expect(useNotificationsStore.getState().markOpened('n1')).rejects.toThrow('network');
    expect(useNotificationsStore.getState().notifications[0]?.opened).toBe(false);
  });
});
