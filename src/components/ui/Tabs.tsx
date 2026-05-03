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
}

export function Tabs({ tabs, activeTab, onChange, ariaLabel = 'Tabs', className }: TabsProps) {
  const selectedTab = activeTab ?? tabs[0]?.id ?? '';

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
              'min-h-9 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition',
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
            {typeof tab.count === 'number' ? <span className="ml-1 text-xs opacity-80">{tab.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
