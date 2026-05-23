import { create } from 'zustand';
import { parseWidgetPath } from '../routes/widgetPaths';
import type { TabId } from '../types/navigation';

export interface UiState {
  activeTab: TabId;
  activeView: 'widget' | 'own-profile' | 'public-profile' | 'private-profile';
  setActiveTab: (tab: TabId) => void;
  setActiveView: (view: UiState['activeView']) => void;
}

function initialUiState(): Pick<UiState, 'activeTab' | 'activeView'> {
  if (typeof window === 'undefined') {
    return { activeTab: 'home', activeView: 'widget' };
  }
  const route = parseWidgetPath(window.location.pathname, window.location.search);
  return {
    activeTab: route.tab,
    activeView: route.view === 'own-profile' ? 'own-profile' : 'widget',
  };
}

const boot = initialUiState();

export const useUiStore = create<UiState>((set) => ({
  activeTab: boot.activeTab,
  activeView: boot.activeView,
  setActiveTab: (tab) => set({ activeTab: tab, activeView: 'widget' }),
  setActiveView: (view) => set({ activeView: view }),
}));
