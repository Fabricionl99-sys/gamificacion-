import { Clock } from 'lucide-react';
import { useState } from 'react';

import { claimMission } from '../../api/missions';
import { getBestMissionBoost } from '../../features/missions/components/missionBoost';
import { MissionRewardWithBoost } from '../../features/missions/components/MissionRewardWithBoost';
import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useToast } from '../../hooks/useToast';
import { useModalsStore } from '../../store/modalsStore';
import { useMissionsStore } from '../../store/missionsStore';
import { usePlayerStore } from '../../store/playerStore';
import { useUiStore } from '../../store/uiStore';
import type { MissionCategory } from '../../types/mission';
import type { TabId } from '../../types/navigation';
import { formatNumber, formatRelativeShort, formatTimeRemaining, getProgressPercent } from '../../utils/format';
import { emitWidgetEvent } from '../../utils/widgetEvents';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';

const missionTabMap: Partial<Record<MissionCategory, TabId>> = {
  social: 'social',
  predicciones: 'predictions',
};

export default function MissionDetailModal() {
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const mission = useMissionsStore((state) => state.selectedMission);
  const setSelectedMission = useMissionsStore((state) => state.setSelectedMission);
  const bumpRefresh = useMissionsStore((state) => state.bumpRefresh);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const player = usePlayerStore((state) => state.player);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const toast = useToast();
  const { boosts } = useActiveBoosts();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClose = () => {
    setSelectedMission(null);
    closeModal();
  };

  if (!mission) return null;

  const isLocked = mission.status === 'locked';
  const isCompleted = mission.status === 'completed';
  const isClaimed = mission.status === 'claimed';
  const boost = getBestMissionBoost(mission, boosts);
  const deadline = mission.expiresIn ?? formatRelativeShort(mission.expiresAt);

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
      bumpRefresh();
      handleClose();
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
    const tab = missionTabMap[mission.category];
    if (tab) setActiveTab(tab);
    else toast.info(`Abrimos ${mission.category} en el operador`);
    handleClose();
  };

  const handleLockedInfo = () => {
    toast.info(mission.lockReason ?? 'Esta misión todavía está bloqueada');
    handleClose();
  };

  return (
    <Modal
      isOpen={activeModal === 'missionDetail'}
      onClose={handleClose}
      title={mission.title}
      description="detalle de la misión"
    >
      <Card className="space-y-4">
        <p className="text-sm leading-relaxed text-text-secondary">{mission.description}</p>
        <div className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
          progreso:{' '}
          <span className="font-semibold text-text-primary">
            {formatNumber(mission.progress)} / {formatNumber(mission.target)}
          </span>
        </div>
        <div className="mb-1 flex justify-between gap-2 text-xs text-text-tertiary">
          <span>recompensa</span>
          <span className="text-right">
            <MissionRewardWithBoost mission={mission} boosts={boosts} />
            {mission.rewardCoins ? <span className="ml-1 text-coins">+{formatNumber(mission.rewardCoins)}</span> : null}
          </span>
        </div>
        <ProgressBar value={getProgressPercent(mission.progress, mission.target)} />
        {mission.expiresAt ? (
          <Badge tone="info" className="normal-case tracking-normal">
            <Clock className="h-3 w-3" /> termina en {formatTimeRemaining(mission.expiresAt)}
          </Badge>
        ) : null}
        {isLocked && mission.lockReason ? (
          <p className="rounded-md border border-border-subtle bg-bg-tertiary p-3 text-xs text-text-secondary">
            {mission.lockReason}
          </p>
        ) : null}
      </Card>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={handleClose}>
          cerrar
        </Button>
        {isLocked ? (
          <Button variant="secondary" onClick={handleLockedInfo}>
            ver requisito
          </Button>
        ) : isCompleted ? (
          <Button variant="primary" isLoading={isClaiming} onClick={handleClaim}>
            reclamar
          </Button>
        ) : isClaimed ? (
          <Button variant="secondary" disabled>
            reclamada
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNavigate}>
            ir a cumplir
          </Button>
        )}
      </div>
      {!isLocked && !isCompleted && !isClaimed ? (
        <p className="mt-2 text-center text-xs text-text-tertiary">{deadline}</p>
      ) : null}
    </Modal>
  );
}
