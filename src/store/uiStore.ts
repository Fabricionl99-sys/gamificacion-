import { create } from 'zustand';
import { parseWidgetPath } from '../routes/widgetPaths';
import type { WidgetView } from '../routes/widgetPaths';
import type { TabId } from '../types/navigation';

export interface UiState {
  activeTab: TabId;
  activeView: WidgetView;
  playerStateId: string | null;
  setActiveTab: (tab: TabId) => void;
  setActiveView: (view: WidgetView, playerStateId?: string | null) => void;
}

function initialUiState(): Pick<UiState, 'activeTab' | 'activeView' | 'playerStateId'> {
  if (typeof window === 'undefined') {
    return { activeTab: 'home', activeView: 'widget', playerStateId: null };
  }
  const route = parseWidgetPath(window.location.pathname, window.location.search);
  return {
    activeTab: route.tab,
    activeView: route.view,
    playerStateId: route.playerStateId ?? null,
  };
}

const boot = initialUiState();

export const useUiStore = create<UiState>((set) => ({
  activeTab: boot.activeTab,
  activeView: boot.activeView,
  playerStateId: boot.playerStateId,
  setActiveTab: (tab) => set({ activeTab: tab, activeView: 'widget', playerStateId: null }),
  setActiveView: (view, playerStateId = null) => set({ activeView: view, playerStateId: playerStateId ?? null }),
}));
