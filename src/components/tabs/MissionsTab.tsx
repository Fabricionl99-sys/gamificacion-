import { useMemo, useState } from 'react';

import { getMissions } from '../../api/missions';
import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../hooks/useToast';
import type { Mission, MissionCategory } from '../../types/mission';
import type { TabId } from '../../types/navigation';
import { useModalsStore } from '../../store/modalsStore';
import { useMissionsStore } from '../../store/missionsStore';
import { useUiStore } from '../../store/uiStore';
import { getProgressPercent } from '../../utils/format';
import { getDailyMissionStats } from '../../utils/missionStats';
import { MissionCard } from '../shared/MissionCard';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import { tabEmptyStates } from './emptyStateConfig';

type MissionGroupTab = Mission['group'];
type CategoryFilter = 'all' | MissionCategory;

const groupTabs: { id: MissionGroupTab; label: string }[] = [
  { id: 'daily', label: 'hoy' },
  { id: 'weekly', label: 'semana' },
  { id: 'event', label: 'eventos' },
  { id: 'locked', label: 'bloqueadas' },
];

const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'todos' },
  { id: 'deportes', label: 'deportes' },
  { id: 'casino', label: 'casino' },
  { id: 'casino_vivo', label: 'casino vivo' },
  { id: 'virtuales', label: 'virtuales' },
  { id: 'poker', label: 'poker' },
  { id: 'predicciones', label: 'predicciones' },
  { id: 'social', label: 'social' },
];

const missionTabMap: Partial<Record<MissionCategory, TabId>> = {
  social: 'social',
  predicciones: 'predictions',
};

export default function MissionsTab() {
  const refreshToken = useMissionsStore((state) => state.refreshToken);
  const bumpRefresh = useMissionsStore((state) => state.bumpRefresh);
  const setSelectedMission = useMissionsStore((state) => state.setSelectedMission);
  const openModal = useModalsStore((state) => state.openModal);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const toast = useToast();
  const [activeGroup, setActiveGroup] = useState<MissionGroupTab>('daily');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const { data: missions = [], isLoading, error } = useAsyncData(getMissions, [], [refreshToken]);
  const { boosts } = useActiveBoosts();

  const stats = useMemo(() => getDailyMissionStats(missions), [missions]);

  const groupMissions = useMemo(
    () => missions.filter((mission) => mission.group === activeGroup),
    [activeGroup, missions],
  );

  const visibleMissions = useMemo(() => {
    if (activeCategory === 'all') return groupMissions;
    return groupMissions.filter((mission) => mission.category === activeCategory);
  }, [activeCategory, groupMissions]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryFilter, number>([['all', groupMissions.length]]);
    for (const filter of categoryFilters) {
      if (filter.id === 'all') continue;
      counts.set(filter.id, groupMissions.filter((mission) => mission.category === filter.id).length);
    }
    return counts;
  }, [groupMissions]);

  const handleNavigate = (mission: Mission) => {
    const tab = missionTabMap[mission.category];
    if (tab) {
      setActiveTab(tab);
      return;
    }
    toast.info(`Abrimos ${mission.category} en el operador`);
  };

  const handleLockedNavigate = (mission: Mission) => {
    toast.info(mission.lockReason ?? 'Esta misión todavía está bloqueada');
  };

  const openMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    openModal('missionDetail');
  };

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) {
    return (
      <EmptyState
        icon={tabEmptyStates.missions.icon}
        title="no pudimos cargar misiones"
        description="intentá de nuevo en unos segundos."
      />
    );
  }

  if (missions.length === 0) {
    return (
      <EmptyState
        icon={tabEmptyStates.missions.icon}
        title={tabEmptyStates.missions.title}
        description={tabEmptyStates.missions.description}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="card-gradient-surface-missions space-y-3">
        <p className="text-metadata font-medium uppercase tracking-wide text-text-secondary">progreso de hoy</p>
        <p className="text-lg font-semibold text-text-primary">
          {stats.done} de {stats.total} diarias completadas
        </p>
        <ProgressBar value={getProgressPercent(stats.done, Math.max(stats.total, 1))} />
        <div className="flex flex-wrap gap-2 text-module-body text-text-secondary">
          <span>+{stats.earnedXP} XP ganado</span>
          {stats.claimable > 0 ? (
            <span className="font-medium text-accent">{stats.claimable} listas para reclamar</span>
          ) : null}
        </div>
      </Card>

      <Tabs
        tabs={groupTabs.map((tab) => ({
          ...tab,
          count: missions.filter((mission) => mission.group === tab.id).length,
        }))}
        activeTab={activeGroup}
        onChange={(tabId) => {
          setActiveGroup(tabId as MissionGroupTab);
          setActiveCategory('all');
        }}
        ariaLabel="Tipo de misión"
      />

      <Tabs
        tabs={categoryFilters
          .filter((filter) => (categoryCounts.get(filter.id) ?? 0) > 0 || filter.id === 'all')
          .map((filter) => ({
            id: filter.id,
            label: filter.label,
            count: categoryCounts.get(filter.id),
          }))}
        activeTab={activeCategory}
        onChange={(tabId) => setActiveCategory(tabId as CategoryFilter)}
        ariaLabel="Categoría de misión"
      />

      <div className="grid gap-3">
        {visibleMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            boosts={boosts}
            onClaimed={bumpRefresh}
            onNavigate={mission.status === 'locked' ? handleLockedNavigate : handleNavigate}
            onDetail={openMissionDetail}
          />
        ))}
      </div>

      {visibleMissions.length === 0 ? (
        <EmptyState
          icon={tabEmptyStates.missions.icon}
          title="Sin misiones en este filtro"
          description="Probá otra categoría o volvé más tarde."
        />
      ) : null}
    </div>
  );
}
