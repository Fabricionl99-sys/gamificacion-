import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { useUiStore } from '../../store/uiStore';
import { visibleTabs } from './navigation';

export function TabNavigation() {
  const activeTab = useUiStore((state) => state.activeTab);
  const expanded = useUiStore((state) => state.isMobileMenuExpanded);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const swipeHandlers = useSwipeNavigation();
  const visibleItems = expanded ? visibleTabs : visibleTabs.slice(0, 4);

  return (
    <nav
      className="sticky top-[104px] z-20 border-b border-border-default bg-bg-primary/92 px-4 py-3 backdrop-blur-xl md:hidden"
      aria-label="Navegacion principal"
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        {visibleItems.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={activeTab === item.id ? 'primary' : 'ghost'}
            className="shrink-0 capitalize"
            onClick={() => setActiveTab(item.id)}
            aria-pressed={activeTab === item.id}
          >
            {item.shortLabel}
          </Button>
        ))}
        {!expanded && (
          <Button size="sm" variant="secondary" className="shrink-0" onClick={toggleMobileMenu}>
            +{visibleTabs.length - 4} <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </nav>
  );
}
