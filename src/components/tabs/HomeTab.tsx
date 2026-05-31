import { Gift, Newspaper, Trophy } from 'lucide-react';

import { getMissions } from '../../api/missions';
import { getNews } from '../../api/feed';
import { getPlayerRankings } from '../../api/ranking';
import { getTournaments } from '../../api/tournaments';
import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useModalsStore } from '../../store/modalsStore';
import { useMissionsStore } from '../../store/missionsStore';
import { useTournamentsStore } from '../../store/tournamentsStore';
import type { Mission } from '../../types/mission';
import { formatNumber } from '../../utils/format';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MissionCard } from '../shared/MissionCard';
import { SectionHeader } from '../shared/SectionHeader';
import { StatCard } from '../shared/StatCard';
import { TournamentCard } from '../shared/TournamentCard';
import { usePlayer } from '../../hooks/usePlayer';

export default function HomeTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const setSelectedMission = useMissionsStore((state) => state.setSelectedMission);
  const bumpRefresh = useMissionsStore((state) => state.bumpRefresh);
  const refreshToken = useMissionsStore((state) => state.refreshToken);
  const setSelectedTournament = useTournamentsStore((state) => state.setSelected);
  const { navigateToTab, openDetail } = useWidgetNavigation();
  const { player } = usePlayer();
  const { data: missions = [] } = useAsyncData(getMissions, [], [refreshToken]);
  const { boosts } = useActiveBoosts();
  const { data: tournaments = [] } = useAsyncData(getTournaments, []);
  const { data: news = [] } = useAsyncData(getNews, []);
  const { data: rankings = [] } = useAsyncData(getPlayerRankings, []);

  const dailyMissions = missions.filter((mission) => mission.group === 'daily').slice(0, 3);
  const openMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    openModal('missionDetail');
  };
  const featuredTournament = tournaments[0];
  const latestNews = news[0];
  const topRanking = rankings.find((r) => r.player_position > 0) ?? rankings[0];

  const openTournament = () => {
    if (!featuredTournament) return;
    setSelectedTournament(featuredTournament);
    openDetail('torneos', featuredTournament.code);
  };

  return (
    <div className="space-y-4">
      {player.pendingPrizes > 0 ? (
        <button
          type="button"
          onClick={() => navigateToTab('rewards')}
          className="flex w-full items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-left transition-transform hover:-translate-y-0.5"
        >
          <Gift className="h-5 w-5 text-danger" />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-text-primary">
              tenes {player.pendingPrizes} premios sin reclamar
            </span>
            <span className="text-module-body text-text-secondary">tocá para ver tus premios pendientes</span>
          </span>
        </button>
      ) : null}

      <section>
        <SectionHeader title="Misiones del dia" actionLabel="ver todas" onAction={() => navigateToTab('missions')} />
        <div className="space-y-2">
          {dailyMissions.length === 0 ? (
            <Card className="text-sm text-text-tertiary">Aún no hay misiones disponibles hoy.</Card>
          ) : (
            dailyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                boosts={boosts}
                compact
                onClaimed={bumpRefresh}
                onDetail={openMissionDetail}
              />
            ))
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Tu progreso" />
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="nivel" value={player.level} />
          <StatCard label="racha" value={player.streak} tone="streak" />
          <StatCard label="monedas" value={formatNumber(player.coins)} tone="coins" />
        </div>
      </section>

      {topRanking ? (
        <section>
          <SectionHeader title="Tu posicion en ranking" actionLabel="ver ranking" onAction={() => navigateToTab('ranking')} />
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{topRanking.ranking_name}</p>
              <p className="mt-1 text-2xl font-semibold">
                {topRanking.player_position > 0
                  ? `#${topRanking.player_position} de ${formatNumber(topRanking.total_participants)}`
                  : 'Sin posición aún'}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-coins" />
          </Card>
        </section>
      ) : null}

      <section>
        <SectionHeader title="Torneos activos" actionLabel="ver todos" onAction={() => navigateToTab('tournaments')} />
        {featuredTournament ? (
          <TournamentCard tournament={featuredTournament} onAction={openTournament} />
        ) : (
          <Card className="text-sm text-text-tertiary">No hay torneos activos por ahora.</Card>
        )}
      </section>

      <section>
        <SectionHeader title="Ultimas noticias" actionLabel="ver noticias" onAction={() => navigateToTab('news')} />
        {latestNews ? (
          <Card className="flex gap-3">
            <Newspaper className="h-5 w-5 text-info" />
            <div>
              <p className="text-sm font-semibold">{latestNews.title}</p>
              <p className="mt-1 text-module-body text-text-secondary">{latestNews.body}</p>
            </div>
          </Card>
        ) : (
          <Card className="text-sm text-text-tertiary">Sin noticias publicadas.</Card>
        )}
      </section>
    </div>
  );
}
