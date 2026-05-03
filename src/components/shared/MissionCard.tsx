import { Lock } from 'lucide-react';
import type { Mission } from '../../types/mission';
import { formatNumber, formatRelativeShort, getProgressPercent } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface MissionCardProps {
  mission: Mission;
  compact?: boolean;
}

export function MissionCard({ mission, compact = false }: MissionCardProps) {
  const isLocked = mission.status === 'locked';
  const isCompleted = mission.status === 'completed';
  const deadline = mission.expiresIn ?? formatRelativeShort(mission.expiresAt);

  return (
    <Card className={isLocked ? 'relative opacity-55' : undefined} padding="sm">
      {isLocked ? (
        <div className="absolute right-3 top-3 rounded-full bg-bg-elevated p-1 text-text-tertiary">
          <Lock className="h-3 w-3" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-text-primary">{mission.title}</h3>
          <p className="mt-1 text-xs text-text-secondary">{mission.description}</p>
        </div>
        <Badge variant={isCompleted ? 'success' : mission.group === 'event' ? 'warning' : 'default'}>{mission.category}</Badge>
      </div>
      <div className="mt-3">
        <div className="mb-2 flex justify-between text-xs text-text-tertiary">
          <span>
            {formatNumber(mission.progress)} / {formatNumber(mission.target)}
          </span>
          <span>+{formatNumber(mission.rewardXP)} XP</span>
        </div>
        <ProgressBar value={getProgressPercent(mission.progress, mission.target)} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className={isCompleted ? 'text-xs font-medium text-success' : 'text-xs text-text-tertiary'}>
          {isLocked ? mission.lockReason : isCompleted ? 'completada' : deadline}
        </p>
        {isCompleted && !compact ? (
          <Button size="sm" variant="primary">
            reclamar
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
