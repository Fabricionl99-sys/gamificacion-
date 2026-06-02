import type { TabId } from '../../types/navigation';
import { useBrandingStore } from '../../store/brandingStore';
import { useUiStore } from '../../store/uiStore';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useWidgetVisibleTabs } from '../../hooks/useWidgetVisibleTabs';
import { cn } from '../../utils/classnames';
import { getTabIcon } from './navigation';

interface DesktopSidebarProps {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
}

export function DesktopSidebar({ activeTab, onSelect }: DesktopSidebarProps) {
  const branding = useBrandingStore((s) => s.config);
  const activeView = useUiStore((s) => s.activeView);
  const { navigateToProfile } = useWidgetNavigation();
  const visibleTabs = useWidgetVisibleTabs();

  const handleSelect = (tabId: TabId) => {
    if (tabId === 'profile') {
      navigateToProfile();
      return;
    }
    onSelect(tabId);
  };

  return (
    <aside className="hidden w-60 shrink-0 md:block" aria-label="Navegacion principal">
      <div className="sticky top-5 space-y-3 rounded-xl border border-border-default bg-bg-secondary/70 p-3 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-2 px-2 py-2">
          {branding?.logo_url ? (
            <img src={branding.logo_url} alt="" className="h-9 w-9 rounded-lg object-contain" />
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {branding?.operator_name ?? 'Gamificacion'}
            </p>
            <p className="mt-0.5 truncate text-metadata text-text-tertiary">
              {branding?.welcome_text ?? 'Widget jugador'}
            </p>
          </div>
        </div>
        <nav className="space-y-1">
          {visibleTabs.map((tab) => {
            const Icon = getTabIcon(tab.id);
            const isActive =
              tab.id === 'profile' ? activeView === 'own-profile' : activeTab === tab.id && activeView === 'widget';

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelect(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-3 text-left text-sm font-medium transition duration-200 hover:translate-x-0.5',
                  isActive
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-accent' : 'text-text-tertiary')} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
