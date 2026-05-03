import { Gift, Newspaper, Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MissionCard } from '../shared/MissionCard';
import { SectionHeader } from '../shared/SectionHeader';
import { StatCard } from '../shared/StatCard';
import { TournamentCard } from '../shared/TournamentCard';
import { mockMissions, mockNews, mockPlayer, mockTournaments } from '../../mocks';
import { useModalsStore } from '../../store/modalsStore';
import { useUiStore } from '../../store/uiStore';
import { formatNumber } from '../../utils/format';

export default function HomeTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const { setActiveTab, setActiveView } = useUiStore();
  const dailyMissions = mockMissions.slice(0, 3);
  const featuredTournament = mockTournaments[0];
  const latestNews = mockNews[0];

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setActiveView('own-profile')}
        className="flex w-full items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-left transition-transform hover:-translate-y-0.5"
      >
        <Gift className="h-5 w-5 text-danger" />
        <span className="flex-1">
          <span className="block text-sm font-semibold text-text-primary">tenes {mockPlayer.pendingPrizes} premios sin reclamar</span>
          <span className="text-xs text-text-secondary">tocá para ver tus premios pendientes</span>
        </span>
      </button>

      <section>
        <SectionHeader title="Misiones del dia" actionLabel="ver todas" onAction={() => setActiveTab('missions')} />
        <div className="space-y-2">
          {dailyMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} compact />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Tu progreso" />
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="nivel" value={mockPlayer.level} />
          <StatCard label="racha" value={mockPlayer.streak} tone="streak" />
          <StatCard label="monedas" value={formatNumber(mockPlayer.coins)} tone="coins" />
        </div>
      </section>

      <Card variant="neon" className="scan-effect overflow-hidden">
        <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">promo destacada</p>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">Weekend boost x2 XP</h2>
        <p className="mt-2 text-sm text-text-secondary">Activa el multiplicador desde la tienda y suma doble XP en deportes.</p>
        <Button className="mt-4" variant="primary" onClick={() => setActiveTab('shop')}>
          ir a tienda
        </Button>
      </Card>

      <section>
        <SectionHeader title="Tu posicion en ranking" actionLabel="ver ranking" onAction={() => setActiveTab('ranking')} />
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Liga oro · zona de ascenso</p>
            <p className="mt-1 text-2xl font-semibold">#5 de 50</p>
          </div>
          <Trophy className="h-8 w-8 text-coins" />
        </Card>
      </section>

      <section>
        <SectionHeader title="Torneos activos" actionLabel="ver todos" onAction={() => setActiveTab('tournaments')} />
        {featuredTournament ? (
          <TournamentCard tournament={featuredTournament} onAction={() => openModal('tournamentRegister')} />
        ) : null}
      </section>

      <section>
        <SectionHeader title="Ultimas noticias" actionLabel="ver noticias" onAction={() => setActiveTab('news')} />
        {latestNews ? (
          <Card className="flex gap-3">
            <Newspaper className="h-5 w-5 text-info" />
            <div>
              <p className="text-sm font-semibold">{latestNews.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{latestNews.body}</p>
            </div>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
