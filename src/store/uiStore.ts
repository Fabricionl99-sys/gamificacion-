import { create } from 'zustand';
import type { TabId } from '../types/navigation';

export interface UiState {
  activeTab: TabId;
  activeView: 'widget' | 'own-profile' | 'public-profile' | 'private-profile';
  setActiveTab: (tab: TabId) => void;
  setActiveView: (view: UiState['activeView']) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'home',
  activeView: 'widget',
  setActiveTab: (tab) => set({ activeTab: tab, activeView: 'widget' }),
  setActiveView: (view) => set({ activeView: view }),
}));
