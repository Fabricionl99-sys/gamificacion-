import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '../ui/Button';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { useUiStore } from '../../store/uiStore';
import { visibleTabs } from './navigation';
import { cn } from '../../utils/classnames';

export function TabNavigation() {
  const activeTab = useUiStore((state) => state.activeTab);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const swipeHandlers = useSwipeNavigation();
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
  }, [updateFades, activeTab]);

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
    const id = scrollRef.current?.querySelector<HTMLElement>(`[data-tab-id="${activeTab}"]`);
    if (!id) return;
    if (typeof id.scrollIntoView === 'function') {
      id.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    const parent = scrollRef.current;
    if (!parent) return;
    const left = id.offsetLeft - (parent.clientWidth - id.clientWidth) / 2;
    const target = Math.max(0, left);
    if (typeof parent.scrollTo === 'function') {
      parent.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      parent.scrollLeft = target;
    }
  }, [activeTab]);

  return (
    <nav
      className="sticky top-[104px] z-20 border-b border-border-default bg-bg-primary/92 px-3 py-3 backdrop-blur-xl md:hidden"
      aria-label="Navegacion principal"
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
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
          <div
            className="pointer-events-none absolute left-1 top-1/2 z-[1] -translate-y-1/2"
            aria-hidden
          >
            <ChevronLeft className="h-4 w-4 text-text-tertiary/80" strokeWidth={2.5} />
          </div>
        ) : null}

        <div
          ref={scrollRef}
          onScroll={updateFades}
          className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {visibleTabs.map((item) => (
            <Button
              key={item.id}
              data-tab-id={item.id}
              size="md"
              variant={activeTab === item.id ? 'primary' : 'ghost'}
              className="h-auto min-h-[42px] shrink-0 whitespace-nowrap px-3 py-2 text-sm font-semibold capitalize leading-tight"
              onClick={() => setActiveTab(item.id)}
              aria-pressed={activeTab === item.id}
            >
              {item.shortLabel}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
