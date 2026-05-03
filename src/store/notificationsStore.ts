import { create } from 'zustand';
import { mockNotifications } from '../mocks';

export interface NotificationsState {
  unreadCount: number;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  unreadCount: mockNotifications.filter((notification) => !notification.read).length,
  markAllRead: () => set({ unreadCount: 0 }),
}));
