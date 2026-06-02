import { useMemo } from 'react';

import { getChestInventory } from '../api/chests';
import { getWheelsInventory } from '../api/wheels';
import { FEATURES } from '../config/features';
import { PILOT } from '../config/pilot';
import { widgetTabs } from '../components/layout/navigation';
import { useAsyncData } from './useAsyncData';
import type { WidgetTabConfig } from '../types/navigation';

/** Tabs visibles: orden fijo + social solo si flag + cofres solo con inventario. */
export function useWidgetVisibleTabs(): WidgetTabConfig[] {
  const { data: chests = [] } = useAsyncData(getChestInventory, [], []);
  const { data: wheels = [] } = useAsyncData(getWheelsInventory, [], []);
  const hasRewardsInventory = chests.length > 0 || wheels.length > 0;

  return useMemo(() => {
    let list = widgetTabs.filter((tab) => tab.id !== 'social' || FEATURES.social_enabled);

    if (PILOT.isActive() && PILOT.socialOnly) {
      return list.filter((tab) => tab.id === 'social');
    }

    if (!hasRewardsInventory) {
      list = list.filter((tab) => tab.id !== 'rewards');
    }

    return list;
  }, [hasRewardsInventory]);
}
