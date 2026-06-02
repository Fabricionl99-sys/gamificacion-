import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '../ui/Button';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useWidgetVisibleTabs } from '../../hooks/useWidgetVisibleTabs';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../utils/classnames';

export function TabNavigation() {
  const activeTab = useUiStore((state) => state.activeTab);
  const activeView = useUiStore((state) => state.activeView);
  const { navigateToTab, navigateToProfile } = useWidgetNavigation();
  const visibleTabs = useWidgetVisibleTabs();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(true);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setFadeLeft(scrollLeft > 6);
    setFadeRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useLayoutEffect(() => {
    updateFades();
  }, [updateFades, activeTab, visibleTabs.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (typeof ResizeObserver === 'undefined') {
      updateFades();
      return;
    }
    const ro = new ResizeObserver(() => updateFades());
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateFades]);

  useEffect(() => {
    const tabId = activeView === 'own-profile' ? 'profile' : activeTab;
    const id = scrollRef.current?.querySelector<HTMLElement>(`[data-tab-id="${tabId}"]`);
    if (!id) return;
    if (typeof id.scrollIntoView === 'function') {
      id.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    const parent = scrollRef.current;
    if (!parent) return;
    const left = id.offsetLeft - (parent.clientWidth - id.clientWidth) / 2;
    if (typeof parent.scrollTo === 'function') {
      parent.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    } else {
      parent.scrollLeft = Math.max(0, left);
    }
  }, [activeTab, activeView]);

  const handleSelect = (tabId: (typeof visibleTabs)[number]['id']) => {
    if (tabId === 'profile') {
      navigateToProfile();
      return;
    }
    navigateToTab(tabId);
  };

  return (
    <nav
      className="sticky top-[96px] z-20 -mt-0.5 border-b border-border-default bg-bg-primary/92 px-3 py-2 backdrop-blur-xl md:hidden"
      aria-label="Navegacion principal"
    >
      <div className="relative">
        <div
          className={cn(
            'pointer-events-none absolute left-0 top-0 z-[1] h-full w-8 bg-gradient-to-r from-bg-primary to-transparent transition-opacity duration-200',
            fadeLeft ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden
        />
        <div
          className={cn(
            'pointer-events-none absolute right-0 top-0 z-[1] flex h-full w-10 items-center justify-end bg-gradient-to-l from-bg-primary via-bg-primary/90 to-transparent pr-0.5 transition-opacity duration-200',
            fadeRight ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden
        >
          <ChevronRight className="h-4 w-4 text-text-tertiary" strokeWidth={2.5} />
        </div>
        {fadeLeft ? (
          <div className="pointer-events-none absolute left-1 top-1/2 z-[1] -translate-y-1/2" aria-hidden>
            <ChevronLeft className="h-4 w-4 text-text-tertiary/80" strokeWidth={2.5} />
          </div>
        ) : null}

        <div
          ref={scrollRef}
          onScroll={updateFades}
          className={cn(
            'tab-nav-scroll flex gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-0.5',
            '[-ms-overflow-style:none] [scrollbar-width:thin]',
            '[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-track]:bg-transparent',
          )}
        >
          {visibleTabs.map((item) => {
            const isActive =
              item.id === 'profile' ? activeView === 'own-profile' : activeTab === item.id && activeView === 'widget';
            return (
              <Button
                key={item.id}
                data-tab-id={item.id}
                size="md"
                variant={isActive ? 'primary' : 'ghost'}
                className="h-auto min-h-[42px] shrink-0 snap-center whitespace-nowrap px-3 py-2 text-sm font-semibold capitalize leading-tight"
                onClick={() => handleSelect(item.id)}
                aria-pressed={isActive}
              >
                {item.shortLabel}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
