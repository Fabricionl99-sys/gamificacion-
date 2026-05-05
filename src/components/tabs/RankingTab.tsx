import { useState } from 'react';
import { ShieldCheck, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { getRanking } from '../../api/ranking';
import { useAsyncData } from '../../hooks/useAsyncData';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PlayerListItem } from '../shared/PlayerListItem';
import { SectionHeader } from '../shared/SectionHeader';
import { useModalsStore } from '../../store/modalsStore';
import { formatNumber } from '../../utils/format';
import { RankingEmptyState } from './emptyStateCopy';

export default function RankingTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { data: ranking = [], isLoading, error } = useAsyncData(getRanking, []);
  const self = ranking.find((player) => player.isSelf);

  if (isLoading) return <Card className="h-32 animate-pulse" />;
  if (error) return <RankingEmptyState />;
  if (ranking.length === 0) {
    return <RankingEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-bg-secondary p-1">
        <Button
          aria-pressed={period === 'week'}
          onClick={() => setPeriod('week')}
          variant={period === 'week' ? 'primary' : 'ghost'}
          size="sm"
        >
          esta semana
        </Button>
        <Button
          aria-pressed={period === 'month'}
          onClick={() => setPeriod('month')}
          variant={period === 'month' ? 'primary' : 'ghost'}
          size="sm"
        >
          este mes
        </Button>
      </div>

      <Card variant="neon" className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge tone="warning">liga oro</Badge>
          <Trophy className="h-5 w-5 text-coins" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">division actual</p>
          <h2 className="text-xl font-semibold text-text-primary">Duelo Alpha · grupo 14</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-bg-tertiary p-3">
            <p className="text-xs text-text-tertiary">tu posicion</p>
            <p className="text-2xl font-semibold">
              #{self?.position ?? 5}
              <span className="text-sm text-text-tertiary"> / 50</span>
            </p>
          </div>
          <div className="rounded-md bg-bg-tertiary p-3">
            <p className="text-xs text-text-tertiary">XP semanal</p>
            <p className="text-2xl font-semibold">{formatNumber(self?.weeklyXP ?? 0)}</p>
          </div>
        </div>
      </Card>

      <div className="rounded-lg border border-accent/30 bg-accent-subtle p-3 text-sm text-text-primary">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp className="h-4 w-4 text-accent" />
          zona de ascenso · top 5 sube
        </div>
      </div>

      <SectionHeader title="top 5" actionLabel="ver los 50 jugadores" onAction={() => openModal('divisionPrizes')} />
      <div className="space-y-2">
        {ranking.slice(0, 5).map((player) => (
          <PlayerListItem key={player.id} player={player} />
        ))}
      </div>

      <Card className="flex items-center justify-between bg-info/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-info" />
          <span className="text-sm font-medium">vos estas destacado aunque salgas del top visible</span>
        </div>
        <Badge tone="info">vos</Badge>
      </Card>

      <div className="rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-danger" />
          zona de descenso · bottom 5 baja
        </div>
      </div>

      <Button className="w-full" variant="secondary" onClick={() => openModal('divisionPrizes')}>
        ver premios de division
      </Button>
    </div>
  );
}
