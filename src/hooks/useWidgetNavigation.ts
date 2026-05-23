import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  buildDetailPath,
  buildProfilePath,
  buildTabPath,
  parseWidgetPath,
  type WidgetDetailSection,
} from '../routes/widgetPaths';
import { useUiStore } from '../store/uiStore';
import type { TabId } from '../types/navigation';

export function useWidgetNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = useUiStore((state) => state.activeTab);
  const activeView = useUiStore((state) => state.activeView);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const setActiveView = useUiStore((state) => state.setActiveView);

  const route = parseWidgetPath(location.pathname, location.search);

  useEffect(() => {
    if (route.view === 'own-profile') {
      if (activeView !== 'own-profile') setActiveView('own-profile');
      return;
    }
    if (activeView !== 'widget' || activeTab !== route.tab) {
      setActiveTab(route.tab);
    }
  }, [route.tab, route.view, activeTab, activeView, setActiveTab, setActiveView]);

  const navigateToTab = useCallback(
    (tab: TabId) => {
      navigate(buildTabPath(tab));
    },
    [navigate],
  );

  const navigateToProfile = useCallback(() => {
    navigate(buildProfilePath());
  }, [navigate]);

  const navigateBackFromProfile = useCallback(() => {
    navigate(buildTabPath(activeTab));
  }, [navigate, activeTab]);

  const openDetail = useCallback(
    (section: WidgetDetailSection, id: string, action?: string) => {
      navigate(buildDetailPath(section, id, action));
    },
    [navigate],
  );

  const closeDetail = useCallback(
    (tab: TabId) => {
      navigate(buildTabPath(tab));
    },
    [navigate],
  );

  return {
    route,
    navigateToTab,
    navigateToProfile,
    navigateBackFromProfile,
    openDetail,
    closeDetail,
  };
}
