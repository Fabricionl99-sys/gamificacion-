import { cn } from '../../utils/classnames';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabOption[];
  activeTab?: string;
  onChange: (tab: string) => void;
  ariaLabel?: string;
  className?: string;
  /** Larger touch targets; label size stays text-submenu (14px). */
  tabSize?: 'default' | 'comfortable';
}

export function Tabs({ tabs, activeTab, onChange, ariaLabel = 'Tabs', className, tabSize = 'default' }: TabsProps) {
  const selectedTab = activeTab ?? tabs[0]?.id ?? '';
  const sizeClasses =
    tabSize === 'comfortable'
      ? 'min-h-11 px-4 py-2.5 text-submenu font-semibold rounded-lg'
      : 'min-h-9 px-3 py-2 text-submenu font-medium rounded-md';

  return (
    <div
      aria-label={ariaLabel}
      className={cn('no-scrollbar flex gap-2 overflow-x-auto', className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === selectedTab;
        return (
          <button
            aria-selected={isActive}
            className={cn(
              'whitespace-nowrap transition',
              sizeClasses,
              isActive
                ? 'bg-accent text-bg-primary shadow-glow'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
            )}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
            {typeof tab.count === 'number' ? (
              <span className="ml-1 opacity-80 text-submenu">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
