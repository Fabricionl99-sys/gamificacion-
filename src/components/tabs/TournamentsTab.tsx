import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { getTournaments } from '../../api/tournaments';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { TournamentCard } from '../shared/TournamentCard';
import { SectionHeader } from '../shared/SectionHeader';
import { TournamentEmptyState } from './emptyStateCopy';

const filters = [
  { id: 'activos', label: 'activos' },
  { id: 'inscrito', label: 'inscrito' },
  { id: 'proximos', label: 'proximos' },
  { id: 'finalizados', label: 'finalizados' },
];

export default function TournamentsTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const [activeFilter, setActiveFilter] = useState('activos');
  const { data: tournaments = [], isLoading, error } = useAsyncData(getTournaments, []);
  const featured = tournaments[0];

  if (isLoading) {
    return <Card className="animate-pulse text-sm text-text-tertiary">Cargando torneos...</Card>;
  }

  if (error) {
    return <Card className="text-sm text-danger">No pudimos cargar torneos.</Card>;
  }

  if (!featured) {
    return (
      <div className="space-y-4">
        <Tabs tabs={filters} activeTab={activeFilter} onChange={setActiveFilter} ariaLabel="Filtros de torneos" />
        <TournamentEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="neon" className="card-gradient-surface-tournaments overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-warning/15 text-warning">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-warning">torneo destacado</p>
            <h2 className="text-lg font-semibold text-text-primary">{featured.name}</h2>
            <p className="text-sm text-text-secondary">{featured.prizePool} en premios · {featured.endsIn}</p>
          </div>
        </div>
      </Card>
      <Tabs tabs={filters} activeTab={activeFilter} onChange={setActiveFilter} ariaLabel="Filtros de torneos" />
      <SectionHeader title="Eventos competitivos" actionLabel="ver detalle" onAction={() => openModal('tournamentRegister')} />
      <div className="space-y-3">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} onAction={() => openModal('tournamentRegister')} />
        ))}
      </div>
      <Card>
        <SectionHeader title="Detalle rapido" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          {['prize pool $8,000', '2 dias restantes', '842 inscritos', 'mi posicion #37'].map((stat) => (
            <div key={stat} className="rounded-md bg-bg-tertiary p-3 text-text-secondary">
              {stat}
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full" variant="primary" onClick={() => openModal('tournamentRegister')}>
          confirmar inscripcion
        </Button>
      </Card>
    </div>
  );
}
