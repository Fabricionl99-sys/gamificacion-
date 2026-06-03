import { useMemo } from 'react';

import { FEATURES } from '../config/features';
import { PILOT } from '../config/pilot';
import { widgetTabs } from '../components/layout/navigation';
import type { WidgetTabConfig } from '../types/navigation';

/** Tabs visibles: orden fijo + social solo si flag. Cofres siempre visible (empty state en RewardsTab). */
export function useWidgetVisibleTabs(): WidgetTabConfig[] {
  return useMemo(() => {
    let list = widgetTabs.filter((tab) => tab.id !== 'social' || FEATURES.social_enabled);

    if (PILOT.isActive() && PILOT.socialOnly) {
      return list.filter((tab) => tab.id === 'social');
    }

    return list;
  }, []);
}
