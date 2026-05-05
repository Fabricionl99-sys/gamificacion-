import { useState } from 'react';
import { ArrowDown, ArrowUp, List, Minus, Trophy } from 'lucide-react';

import { getPlayerRankings, getRankingLeaderboard } from '../../api/ranking';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { LeaderboardFull, PlayerRankingSummary } from '../../types/ranking';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { RankingEmptyState } from './emptyStateCopy';

export default function RankingTab() {
  const { data: rankings = [], isLoading, error } = useAsyncData(getPlayerRankings, []);
  const [viewAll, setViewAll] = useState(false);
  const [selected, setSelected] = useState<PlayerRankingSummary | null>(null);
  const active = rankings.filter((ranking) => ranking.active).sort((a, b) => a.display_order - b.display_order);
  const highlighted = active.slice(0, 2);
  const remaining = active.slice(2);
  const bestPosition = Math.min(...active.map((ranking) => ranking.player_position));

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <RankingEmptyState />;
  if (active.length === 0) return <RankingEmptyState />;

  return (
    <div className="space-y-4">
      <SectionIntro activeCount={active.length} bestPosition={bestPosition} />

      {viewAll ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Todos los rankings activos</h3>
            <Button size="sm" variant="ghost" onClick={() => setViewAll(false)}>
              ver destacados
            </Button>
          </div>
          {active.map((ranking) => (
            <RankingMiniCard key={ranking.ranking_id} ranking={ranking} onOpen={() => setSelected(ranking)} />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {highlighted.map((ranking) => (
              <RankingHighlightCard key={ranking.ranking_id} ranking={ranking} onOpen={() => setSelected(ranking)} />
            ))}
          </div>
          {remaining.length > 0 ? <MoreRankingsCard rankings={remaining} onViewAll={() => setViewAll(true)} /> : null}
        </>
      )}

      <LeaderboardModal ranking={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SectionIntro({ activeCount, bestPosition }: { activeCount: number; bestPosition: number }) {
  return (
    <Card variant="neon" className="scan-effect">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-coins/15 text-coins">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Ranking</p>
          <h2 className="text-lg font-semibold text-text-primary">competí con otros jugadores y ganá premios</h2>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="rankings activos" value={String(activeCount)} />
        <Stat label="mejor posición" value={`#${bestPosition}`} />
      </div>
    </Card>
  );
}

function RankingHighlightCard({ ranking, onOpen }: { ranking: PlayerRankingSummary; onOpen: () => void }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent-subtle text-3xl">{ranking.ranking_icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">{ranking.ranking_name}</h3>
            <ChangeBadge change={ranking.player_change} />
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            #{ranking.player_position} de {formatNumber(ranking.total_participants)} · cierra en {formatTimeRemaining(ranking.closes_at)}
          </p>
          <p className="mt-2 text-sm text-coins">Premio estimado: {formatNumber(ranking.player_potential_prize)} monedas</p>
        </div>
      </div>

      <div className="rounded-lg bg-bg-tertiary p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">top 5</p>
        <div className="space-y-2">
          {ranking.top_5.map((entry, index) => (
            <div key={entry.handle} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                #{index + 1} {entry.handle} {entry.verified ? '✓' : ''}
              </span>
              <b className="text-text-primary">{formatNumber(entry.metric_value)}</b>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" variant="primary" onClick={onOpen}>
        Ver leaderboard completo →
      </Button>
    </Card>
  );
}

function RankingMiniCard({ ranking, onOpen }: { ranking: PlayerRankingSummary; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="w-full rounded-lg border border-border-default bg-bg-secondary p-4 text-left transition hover:bg-bg-tertiary">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{ranking.ranking_icon}</span>
        <span className="flex-1">
          <span className="block font-semibold text-text-primary">{ranking.ranking_name}</span>
          <span className="text-xs text-text-tertiary">
            tu posición #{ranking.player_position} · {formatTimeRemaining(ranking.closes_at)}
          </span>
        </span>
        <List className="h-4 w-4 text-accent" />
      </div>
    </button>
  );
}

function MoreRankingsCard({ rankings, onViewAll }: { rankings: PlayerRankingSummary[]; onViewAll: () => void }) {
  return (
    <Card className="space-y-3 bg-bg-tertiary">
      <h3 className="font-semibold text-text-primary">Hay {rankings.length} rankings activos más</h3>
      {rankings.map((ranking) => (
        <p key={ranking.ranking_id} className="text-sm text-text-secondary">
          {ranking.ranking_icon} {ranking.ranking_name} · tu posición #{ranking.player_position}
        </p>
      ))}
      <Button className="w-full" onClick={onViewAll}>
        Ver todos →
      </Button>
    </Card>
  );
}

function LeaderboardModal({ ranking, onClose }: { ranking: PlayerRankingSummary | null; onClose: () => void }) {
  const { data } = useAsyncData<LeaderboardFull | null>(() => (ranking ? getRankingLeaderboard(ranking.ranking_id) : Promise.resolve(null)), null, [ranking?.ranking_id]);
  if (!ranking) return null;
  const entries = data?.entries ?? [];
  const playerInsideTop = entries.some((entry) => entry.is_self);

  return (
    <Modal isOpen onClose={onClose} title={ranking.ranking_name} description={`cierra en ${formatTimeRemaining(ranking.closes_at)}`}>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.position} className={`grid grid-cols-[48px_1fr_auto] items-center gap-2 rounded-md p-3 ${entry.is_self ? 'border border-accent bg-accent-subtle' : 'bg-bg-secondary'}`}>
            <b>#{entry.position}</b>
            <span className="text-sm text-text-secondary">
              {entry.handle} {entry.verified ? '✓' : ''}
            </span>
            <span className="text-sm font-semibold">{formatNumber(entry.metric_value)}</span>
          </div>
        ))}
        {!playerInsideTop ? (
          <Card className="border-accent/30 bg-accent-subtle">
            Tu posición actual: <b>#{data?.player_position ?? ranking.player_position}</b>
          </Card>
        ) : null}
      </div>
    </Modal>
  );
}

function ChangeBadge({ change }: { change: number }) {
  if (change > 0) return <Badge tone="success"><ArrowUp className="h-3 w-3" />{change} posiciones</Badge>;
  if (change < 0) return <Badge tone="danger"><ArrowDown className="h-3 w-3" />{Math.abs(change)}</Badge>;
  return <Badge><Minus className="h-3 w-3" />=</Badge>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bg-tertiary p-3">
      <p className="text-[10px] uppercase text-text-tertiary">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
