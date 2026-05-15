import { create } from 'zustand';
import type { TabId } from '../types/navigation';

export interface UiState {
  activeTab: TabId;
  activeView: 'widget' | 'own-profile' | 'public-profile' | 'private-profile';
  isMobileMenuExpanded: boolean;
  setActiveTab: (tab: TabId) => void;
  setActiveView: (view: UiState['activeView']) => void;
  toggleMobileMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'home',
  activeView: 'widget',
  isMobileMenuExpanded: false,
  setActiveTab: (tab) => set({ activeTab: tab, activeView: 'widget', isMobileMenuExpanded: false }),
  setActiveView: (view) => set({ activeView: view }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuExpanded: !state.isMobileMenuExpanded })),
}));
