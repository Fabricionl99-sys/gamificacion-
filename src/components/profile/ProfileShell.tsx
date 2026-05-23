import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { usePlayer } from '../../hooks/usePlayer';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';

interface ProfileShellProps {
  children: ReactNode;
}

export function ProfileShell({ children }: ProfileShellProps) {
  const { player } = usePlayer();
  const { navigateBackFromProfile } = useWidgetNavigation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigateBackFromProfile()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          volver
        </Button>
      </div>
      <section className="card-glass rounded-xl p-5">
        <div className="flex items-center gap-4">
          <Avatar initials={player.avatar} size="xl" status="online" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-text-primary">{player.name}</h1>
              <Badge tone="warning">VIP {player.vipTier}</Badge>
            </div>
            <p className="text-sm text-text-tertiary">@{player.username}</p>
            <p className="mt-2 text-sm text-text-secondary">{player.bio}</p>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
