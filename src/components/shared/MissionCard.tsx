import { Lock } from 'lucide-react';
import { useState } from 'react';

import { claimMission } from '../../api/missions';
import { getBestMissionBoost } from '../../features/missions/components/missionBoost';
import { MissionRewardWithBoost } from '../../features/missions/components/MissionRewardWithBoost';
import { useToast } from '../../hooks/useToast';
import { usePlayerStore } from '../../store/playerStore';
import type { Mission, MissionCategory } from '../../types/mission';
import { formatNumber, formatRelativeShort, getProgressPercent } from '../../utils/format';
import { emitWidgetEvent } from '../../utils/widgetEvents';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface MissionCardProps {
  mission: Mission;
  compact?: boolean;
  boosts?: import('../../types/boost').XPBoost[];
  onClaimed?: () => void;
  onNavigate?: (mission: Mission) => void;
}

const navigateLabels: Record<MissionCategory, string> = {
  deportes: 'ir a deportes',
  casino: 'ir a casino',
  casino_vivo: 'ir a casino en vivo',
  virtuales: 'ir a virtuales',
  poker: 'ir a poker',
  predicciones: 'ir a predicciones',
  social: 'ir a social',
};

export function MissionCard({ mission, compact = false, boosts = [], onClaimed, onNavigate }: MissionCardProps) {
  const toast = useToast();
  const player = usePlayerStore((state) => state.player);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const [isClaiming, setIsClaiming] = useState(false);

  const isLocked = mission.status === 'locked';
  const isCompleted = mission.status === 'completed';
  const isClaimed = mission.status === 'claimed';
  const boost = getBestMissionBoost(mission, boosts);
  const deadline = mission.expiresIn ?? formatRelativeShort(mission.expiresAt);
  const hasBoost = Boolean(boost && !isLocked && !isClaimed);

  const handleClaim = async () => {
    if (!isCompleted || isClaiming) return;
    setIsClaiming(true);
    try {
      const result = await claimMission(mission.id);
      const xpGain = boost ? result.rewardXP * boost.multiplier : result.rewardXP;
      updatePlayer({
        currentXP: player.currentXP + xpGain,
        coins: player.coins + result.rewardCoins,
      });
      emitWidgetEvent('missionClaimed', {
        missionId: mission.id,
        rewardXP: xpGain,
        rewardCoins: result.rewardCoins,
      });
      toast.success(`Reclamaste +${formatNumber(xpGain)} XP`);
      onClaimed?.();
    } catch {
      toast.danger('No pudimos reclamar la misión');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleNavigate = () => {
    emitWidgetEvent('missionNavigate', {
      missionId: mission.id,
      category: mission.category,
      ruleId: mission.ruleId,
    });
    onNavigate?.(mission);
  };

  return (
    <Card
      className={isLocked ? 'relative opacity-60' : hasBoost ? 'border-accent/40 shadow-glow' : undefined}
      padding="sm"
    >
      {isLocked ? (
        <div className="absolute right-3 top-3 rounded-full bg-bg-elevated p-1 text-text-tertiary">
          <Lock className="h-3 w-3" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-text-primary">{mission.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">{mission.description}</p>
        </div>
        <Badge variant={isClaimed ? 'success' : mission.group === 'event' ? 'warning' : 'default'}>{mission.category}</Badge>
      </div>
      <div className="mt-3">
        <MissionProgressMeta mission={mission} boosts={boosts} />
        <ProgressBar value={getProgressPercent(mission.progress, mission.target)} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
        <p
          className={
            isClaimed
              ? 'text-xs font-medium text-success'
              : isCompleted
                ? 'text-xs font-medium text-accent'
                : 'text-xs text-text-tertiary'
          }
        >
          {isLocked ? mission.lockReason : isClaimed ? 'reclamada' : isCompleted ? 'lista para reclamar' : deadline}
        </p>
        {!compact ? (
          <div className="flex shrink-0 gap-2">
            {isLocked ? (
              <Button size="sm" variant="secondary" onClick={handleNavigate}>
                ver requisito
              </Button>
            ) : isCompleted ? (
              <Button size="sm" variant="primary" isLoading={isClaiming} onClick={handleClaim}>
                reclamar
              </Button>
            ) : isClaimed ? null : (
              <Button size="sm" variant="secondary" onClick={handleNavigate}>
                {navigateLabels[mission.category]}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function MissionProgressMeta({
  mission,
  boosts,
}: {
  mission: Mission;
  boosts: import('../../types/boost').XPBoost[];
}) {
  return (
    <div className="mb-2 flex justify-between gap-2 text-xs text-text-tertiary">
      <span>
        {formatNumber(mission.progress)} / {formatNumber(mission.target)}
      </span>
      <span className="text-right">
        <MissionRewardWithBoost mission={mission} boosts={boosts} />
        {mission.rewardCoins ? <span className="ml-1 text-coins">+{formatNumber(mission.rewardCoins)}</span> : null}
      </span>
    </div>
  );
}
