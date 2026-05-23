import { Crown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/classnames';
import { formatNumber } from '../../utils/format';
import type { PublicPlayer } from '../../types/player';

interface PlayerListItemProps {
  player: PublicPlayer;
  rightSlot?: ReactNode;
}

export function PlayerListItem({ player, rightSlot }: PlayerListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-border-subtle bg-bg-secondary p-3',
        player.isSelf && 'border-info/40 bg-info/10',
        player.position === 1 && 'border-coins/40',
      )}
    >
      <span className="w-7 text-center text-sm font-semibold text-text-tertiary">#{player.position}</span>
      <Avatar initials={player.avatar} label={player.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">{player.isAnonymous ? 'anonimo' : player.name}</p>
          {player.position === 1 ? <Crown className="h-4 w-4 text-coins" aria-hidden="true" /> : null}
          {player.isSelf ? <Badge variant="info">vos</Badge> : null}
        </div>
        <p className="text-metadata text-text-tertiary">nivel {player.level} · VIP {player.vipTier}</p>
      </div>
      {rightSlot ?? <p className="text-sm font-semibold text-text-primary">{formatNumber(player.weeklyXP ?? 0)} XP</p>}
    </div>
  );
}
