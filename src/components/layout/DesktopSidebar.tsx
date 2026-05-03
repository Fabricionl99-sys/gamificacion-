import { motion } from 'framer-motion';

import type { TabId } from '../../types/navigation';
import { cn } from '../../utils/classnames';
import { tabs, getTabIcon } from './navigation';

interface DesktopSidebarProps {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
}

export function DesktopSidebar({ activeTab, onSelect }: DesktopSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 md:block" aria-label="Navegacion principal">
      <div className="sticky top-5 space-y-3 rounded-xl border border-border-default bg-bg-secondary/70 p-3 shadow-card backdrop-blur-xl">
        <div className="px-2 py-2">
          <p className="text-sm font-medium text-text-primary">Gamificacion</p>
          <p className="mt-1 text-xs text-text-tertiary">Widget jugador</p>
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = getTabIcon(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => onSelect(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-3 text-left text-sm font-medium transition-colors',
                  isActive
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-accent' : 'text-text-tertiary')} />
                {tab.label}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
