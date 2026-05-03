import { describe, expect, it } from 'vitest';

import { useModalsStore } from './modalsStore';
import { useNotificationsStore } from './notificationsStore';
import { usePlayerStore } from './playerStore';
import { useUiStore } from './uiStore';

describe('stores', () => {
  it('opens and closes modals', () => {
    useModalsStore.getState().openModal('levelUp');
    expect(useModalsStore.getState().activeModal).toBe('levelUp');
    useModalsStore.getState().closeModal();
    expect(useModalsStore.getState().activeModal).toBeNull();
  });

  it('switches tabs and returns to widget view', () => {
    useUiStore.getState().setActiveView('settings');
    useUiStore.getState().setActiveTab('ranking');
    expect(useUiStore.getState().activeTab).toBe('ranking');
    expect(useUiStore.getState().activeView).toBe('widget');
  });

  it('claims pending prizes without going below zero', () => {
    const before = usePlayerStore.getState().player.pendingPrizes;
    usePlayerStore.getState().claimPrize();
    expect(usePlayerStore.getState().player.pendingPrizes).toBe(Math.max(0, before - 1));
  });

  it('marks notifications as read', () => {
    useNotificationsStore.getState().markAllRead();
    expect(useNotificationsStore.getState().unreadCount).toBe(0);
  });
});
