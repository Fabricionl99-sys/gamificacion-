import { ChevronDown, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { MissionCard } from '../shared/MissionCard';
import { mockMissions } from '../../mocks';

const filters = ['todas', 'deportes', 'slots', 'predicciones', 'social'];
const groups = [
  { id: 'daily', label: 'Diarias' },
  { id: 'weekly', label: 'Semanales' },
  { id: 'event', label: 'Eventos especiales' },
  { id: 'locked', label: 'Bloqueadas' },
];

export default function MissionsTab() {
  const completedToday = mockMissions.filter((mission) => mission.status === 'completed').length;
  const earnedXP = mockMissions
    .filter((mission) => mission.status === 'completed')
    .reduce((total, mission) => total + mission.rewardXP, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-[linear-gradient(135deg,rgba(77,159,255,0.18),rgba(10,247,132,0.08))]">
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

      {mockMissions.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-8 w-8" />}
          title="sin misiones por ahora"
          description="vamos a avisarte cuando haya nuevas"
        />
      ) : (
        groups.map((group) => {
          const missions = mockMissions.filter((mission) => mission.group === group.id);
          if (missions.length === 0) return null;

          return (
            <section key={group.id} className="space-y-2">
              <button className="flex w-full items-center justify-between rounded-md border border-border-default bg-bg-secondary px-3 py-2 text-left text-sm font-medium text-text-primary">
                <span>
                  {group.label} · {missions.length}
                </span>
                <ChevronDown className="h-4 w-4 text-text-tertiary" />
              </button>
              <div className="space-y-2">
                {missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
