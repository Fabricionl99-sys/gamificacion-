import { useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';

import { getTournamentDetail, getTournaments } from '../../api/tournaments';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useModalsStore } from '../../store/modalsStore';
import { useTournamentsStore } from '../../store/tournamentsStore';
import type { Tournament } from '../../types/tournament';
import { Card } from '../ui/Card';
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

function filterTournaments(list: Tournament[], filter: string): Tournament[] {
  if (filter === 'inscrito') return list.filter((t) => t.isRegistered);
  if (filter === 'proximos') return list.filter((t) => t.status === 'open' && t.startsIn);
  if (filter === 'finalizados') return list.filter((t) => t.status === 'finished');
  return list.filter((t) => t.status === 'live' || t.status === 'open' || t.status === 'almostFull');
}

export default function TournamentsTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const selected = useTournamentsStore((state) => state.selected);
  const setSelected = useTournamentsStore((state) => state.setSelected);
  const [activeFilter, setActiveFilter] = useState('activos');
  const { data: tournaments = [], isLoading, error } = useAsyncData(getTournaments, []);
  const { route, openDetail, closeDetail } = useWidgetNavigation();

  const detailCode = route.tab === 'tournaments' ? route.detailId : undefined;
  const filtered = useMemo(() => filterTournaments(tournaments, activeFilter), [tournaments, activeFilter]);
  const featured = filtered[0] ?? tournaments[0];

  const detailQuery = useAsyncData(
    () => (detailCode ? getTournamentDetail(detailCode) : Promise.resolve(null)),
    null,
    [detailCode],
  );

  useEffect(() => {
    if (!detailCode) {
      setSelected(null);
      return;
    }
    const fromList = tournaments.find((t) => t.code === detailCode);
    if (fromList) {
      setSelected(fromList);
      return;
    }
    if (detailQuery.data) {
      setSelected(detailQuery.data);
    }
  }, [detailCode, tournaments, detailQuery.data, setSelected]);

  useEffect(() => {
    if (!detailCode || isLoading || detailQuery.isLoading) return;
    const exists = tournaments.some((t) => t.code === detailCode) || detailQuery.data;
    if (!exists) closeDetail('tournaments');
  }, [detailCode, tournaments, detailQuery.data, isLoading, detailQuery.isLoading, closeDetail]);

  useEffect(() => {
    if (route.action === 'register' && selected) {
      openModal('tournamentRegister');
    }
  }, [route.action, selected, openModal]);

  const openTournament = (tournament: Tournament) => {
    setSelected(tournament);
    openDetail('torneos', tournament.code);
  };

  const openRegister = (tournament: Tournament) => {
    setSelected(tournament);
    openModal('tournamentRegister');
  };

  if (isLoading) {
    return <Card className="animate-pulse text-sm text-text-tertiary">Cargando torneos...</Card>;
  }

  if (error) {
    return <Card className="text-sm text-danger">No pudimos cargar torneos.</Card>;
  }

  if (tournaments.length === 0) {
    return (
      <div className="space-y-4">
        <Tabs tabs={filters} activeTab={activeFilter} onChange={setActiveFilter} ariaLabel="Filtros de torneos" />
        <TournamentEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {featured ? (
        <Card variant="neon" className="card-gradient-surface-tournaments overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-warning/15 text-warning">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-metadata uppercase tracking-widest text-warning">torneo destacado</p>
              <h2 className="text-lg font-semibold text-text-primary">{featured.name}</h2>
              <p className="text-sm text-text-secondary">
                {featured.prizePool} en premios · {featured.endsIn ?? featured.startsIn ?? 'próximo'}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <Tabs tabs={filters} activeTab={activeFilter} onChange={setActiveFilter} ariaLabel="Filtros de torneos" />

      {filtered.length === 0 ? (
        <TournamentEmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onAction={() => openTournament(tournament)}
            />
          ))}
        </div>
      )}

      {selected && detailCode ? (
        <Card>
          <SectionHeader title={selected.name} description={selected.description} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-bg-tertiary p-3 text-text-secondary">Premio: {selected.prizePool}</div>
            <div className="rounded-md bg-bg-tertiary p-3 text-text-secondary">
              {selected.endsIn ?? selected.startsIn ?? '—'}
            </div>
            <div className="rounded-md bg-bg-tertiary p-3 text-text-secondary">{selected.participants} inscritos</div>
            <div className="rounded-md bg-bg-tertiary p-3 text-text-secondary">
              {selected.myPosition ? `#${selected.myPosition}` : selected.isRegistered ? 'Inscripto' : 'Sin inscripción'}
            </div>
          </div>
          {!selected.isRegistered && selected.status !== 'finished' ? (
            <button
              type="button"
              className="mt-4 w-full rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg-primary"
              onClick={() => openRegister(selected)}
            >
              confirmar inscripcion
            </button>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
