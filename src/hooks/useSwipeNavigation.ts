import { useCallback, useRef, type TouchEvent } from 'react';
import { tabs } from '../components/layout/navigation';
import { useUiStore } from '../store/uiStore';

interface SwipeHandlers {
  onTouchStart: (event: TouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLElement>) => void;
}

export const useSwipeNavigation = (): SwipeHandlers => {
  const startX = useRef(0);
  const activeTab = useUiStore((state) => state.activeTab);
  const setActiveTab = useUiStore((state) => state.setActiveTab);

  const onTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    startX.current = event.changedTouches[0]?.clientX ?? 0;
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - startX.current;
      if (Math.abs(delta) < 48) {
        return;
      }
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      const nextIndex = delta < 0 ? currentIndex + 1 : currentIndex - 1;
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.id);
      }
    },
    [activeTab, setActiveTab],
  );

  return { onTouchStart, onTouchEnd };
};
