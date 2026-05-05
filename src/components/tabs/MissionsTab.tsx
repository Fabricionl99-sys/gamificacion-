import { ChevronDown } from 'lucide-react';
import type { Mission } from '../../types/mission';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { MissionCard } from '../shared/MissionCard';
import { getMissions } from '../../api/missions';
import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useAsyncData } from '../../hooks/useAsyncData';
import { tabEmptyStates } from './emptyStateConfig';

const filters = ['todas', 'deportes', 'casino', 'casino_vivo', 'virtuales', 'poker', 'predicciones', 'social'];
const groups = [
  { id: 'daily', label: 'Diarias' },
  { id: 'weekly', label: 'Semanales' },
  { id: 'event', label: 'Eventos especiales' },
  { id: 'locked', label: 'Bloqueadas' },
];

export default function MissionsTab() {
  const { data: missions = [], isLoading, error } = useAsyncData<Mission[]>(getMissions, []);
  const { boosts } = useActiveBoosts();
  const completedToday = missions.filter((mission) => mission.status === 'completed').length;
  const earnedXP = missions
    .filter((mission) => mission.status === 'completed')
    .reduce((total, mission) => total + mission.rewardXP, 0);

  if (isLoading) return <Card className="h-32 animate-pulse" />;
  if (error) return <EmptyState icon={tabEmptyStates.missions.icon} title="no pudimos cargar misiones" description="intentá de nuevo en unos segundos." />;

  return (
    <div className="space-y-4">
      <Card className="bg-[linear-gradient(135deg,var(--color-info-soft),var(--accent-subtle))]">
        <p className="text-xs uppercase tracking-wide text-text-secondary">progreso de hoy</p>
        <p className="mt-1 text-lg font-semibold text-text-primary">
          {completedToday} de 5 completadas · +{earnedXP} XP ganado
        </p>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtros de misiones">
        {filters.map((filter, index) => (
          <Badge key={filter} variant={index === 0 ? 'success' : 'neutral'} className="shrink-0">
            {filter}
          </Badge>
        ))}
      </div>

      {missions.length === 0 ? (
        <EmptyState
          icon={tabEmptyStates.missions.icon}
          title={tabEmptyStates.missions.title}
          description={tabEmptyStates.missions.description}
        />
      ) : (
        groups.map((group) => {
          const groupMissions = missions.filter((mission) => mission.group === group.id);
          if (groupMissions.length === 0) return null;

          return (
            <section key={group.id} className="space-y-2">
              <button className="flex w-full items-center justify-between rounded-md border border-border-default bg-bg-secondary px-3 py-2 text-left text-sm font-medium text-text-primary">
                <span>
                  {group.label} · {groupMissions.length}
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary" />
              </button>
              <div className="space-y-2">
                {groupMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} boosts={boosts} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
