import { Gift, Newspaper, Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MissionCard } from '../shared/MissionCard';
import { SectionHeader } from '../shared/SectionHeader';
import { StatCard } from '../shared/StatCard';
import { TournamentCard } from '../shared/TournamentCard';
import { getMissions } from '../../api/missions';
import { getNews } from '../../api/feed';
import { getPlayer } from '../../api/player';
import { getTournaments } from '../../api/tournaments';
import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useModalsStore } from '../../store/modalsStore';
import { useMissionsStore } from '../../store/missionsStore';
import type { Mission } from '../../types/mission';
import { formatNumber } from '../../utils/format';

export default function HomeTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const setSelectedMission = useMissionsStore((state) => state.setSelectedMission);
  const bumpRefresh = useMissionsStore((state) => state.bumpRefresh);
  const refreshToken = useMissionsStore((state) => state.refreshToken);
  const { navigateToTab, navigateToProfile } = useWidgetNavigation();
  const { data: missions = [] } = useAsyncData(getMissions, [], [refreshToken]);
  const { boosts } = useActiveBoosts();
  const { data: tournaments = [] } = useAsyncData(getTournaments, []);
  const { data: news = [] } = useAsyncData(getNews, []);
  const { data: player } = useAsyncData(getPlayer);
  const dailyMissions = missions.filter((mission) => mission.group === 'daily').slice(0, 3);
  const openMissionDetail = (mission: Mission) => {
    setSelectedMission(mission);
    openModal('missionDetail');
  };
  const featuredTournament = tournaments[0];
  const latestNews = news[0];

  return (
    <div className="space-y-4">
      {player ? (
        <button
          type="button"
          onClick={() => navigateToProfile()}
          className="flex w-full items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-left transition-transform hover:-translate-y-0.5"
        >
          <Gift className="h-5 w-5 text-danger" />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-text-primary">tenes {player.pendingPrizes} premios sin reclamar</span>
            <span className="text-module-body text-text-secondary">tocá para ver tus premios pendientes</span>
          </span>
        </button>
      ) : null}

      <section>
        <SectionHeader title="Misiones del dia" actionLabel="ver todas" onAction={() => navigateToTab('missions')} />
        <div className="space-y-2">
          {dailyMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              boosts={boosts}
              compact
              onClaimed={bumpRefresh}
              onDetail={openMissionDetail}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Tu progreso" />
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="nivel" value={player?.level ?? '...'} />
          <StatCard label="racha" value={player?.streak ?? '...'} tone="streak" />
          <StatCard label="monedas" value={player ? formatNumber(player.coins) : '...'} tone="coins" />
        </div>
      </section>

      <Card variant="neon" className="card-gradient-surface-promo scan-effect overflow-hidden">
        <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">promo destacada</p>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">Weekend boost x2 XP</h2>
        <p className="mt-2 text-sm text-text-secondary">Activa el multiplicador desde la tienda y suma doble XP en deportes.</p>
        <Button className="mt-4" variant="primary" onClick={() => navigateToTab('shop')}>
          ir a tienda
        </Button>
      </Card>

      <section>
        <SectionHeader title="Tu posicion en ranking" actionLabel="ver ranking" onAction={() => navigateToTab('ranking')} />
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Mejores en XP · ranking mensual</p>
            <p className="mt-1 text-2xl font-semibold">#12 de 13.064</p>
          </div>
          <Trophy className="h-8 w-8 text-coins" />
        </Card>
      </section>

      <section>
        <SectionHeader title="Torneos activos" actionLabel="ver todos" onAction={() => navigateToTab('tournaments')} />
        {featuredTournament ? (
          <TournamentCard tournament={featuredTournament} onAction={() => openModal('tournamentRegister')} />
        ) : null}
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
        ) : null}
      </section>
    </div>
  );
}
