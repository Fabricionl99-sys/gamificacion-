import { Flame, Gift, Lock, Trophy } from 'lucide-react';
import { useState } from 'react';

import { claimStreak, getStreaks, type StreakProgram } from '../../api/streaks';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/classnames';
import { formatNumber } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { tabEmptyStates } from './emptyStateConfig';

function milestoneLabel(milestone: StreakProgram['milestones'][number]): string {
  const cfg = milestone.reward_config ?? {};
  const kind = String(cfg.kind ?? cfg.type ?? 'reward');
  if (kind === 'coins') return `+${cfg.amount ?? 0} ${cfg.currency_code ?? 'monedas'}`;
  if (kind === 'xp') return `+${cfg.amount ?? cfg.xp ?? 0} XP`;
  return String(cfg.description ?? cfg.label ?? 'Premio');
}

function StreakProgramCard({
  program,
  onClaimed,
}: {
  program: StreakProgram;
  onClaimed: () => void;
}) {
  const toast = useToast();
  const [claiming, setClaiming] = useState(false);
  const currentDay = program.player_state?.current_day ?? 0;
  const nextDay = program.next_reward?.next_day_number ?? currentDay + 1;
  const canClaimLogin = program.activity_type === 'login';

  const handleClaim = async () => {
    if (!canClaimLogin || claiming) return;
    setClaiming(true);
    try {
      await claimStreak(program.streak_program_id);
      toast.success('Asistencia marcada');
      onClaimed();
    } catch {
      toast.danger('No pudimos marcar la asistencia');
    } finally {
      setClaiming(false);
    }
  };

  const maxDay = program.milestones.length
    ? Math.max(...program.milestones.map((m) => m.day_number))
    : Math.max(nextDay, currentDay, 7);

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-text-primary">{program.name}</p>
          {program.description ? (
            <p className="mt-1 text-sm text-text-secondary">{program.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-text-tertiary">
            Día actual: <span className="font-semibold text-streak">{currentDay}</span>
            {' · '}
            Siguiente: <span className="font-semibold text-text-primary">{nextDay}</span>
          </p>
        </div>
        <Badge variant="warning">{program.activity_type}</Badge>
      </div>

      {program.milestones.length > 0 ? (
        <div className="space-y-2">
          <p className="text-metadata font-medium uppercase tracking-wide text-text-tertiary">Hitos</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {program.milestones.map((milestone) => {
              const reached = currentDay >= milestone.day_number;
              return (
                <div
                  key={milestone.day_number}
                  className={cn(
                    'min-w-[88px] shrink-0 rounded-lg border p-2 text-center text-xs',
                    reached
                      ? 'border-streak/40 bg-streak/10 text-streak'
                      : 'border-border-default bg-bg-tertiary text-text-tertiary',
                  )}
                >
                  <div className="mb-1 flex justify-center">
                    {reached ? <Trophy className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                  </div>
                  <p className="font-semibold">Día {milestone.day_number}</p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-tight">{milestoneLabel(milestone)}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : maxDay > 0 ? (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: Math.min(maxDay, 14) }, (_, i) => i + 1).map((day) => {
            const reached = day <= currentDay;
            return (
              <div
                key={day}
                className={cn(
                  'grid aspect-square place-items-center rounded-md border text-xs font-semibold',
                  reached
                    ? 'border-streak/40 bg-streak/15 text-streak'
                    : 'border-dashed border-border-default bg-bg-tertiary text-text-tertiary',
                )}
              >
                {reached ? <Flame className="h-3.5 w-3.5" /> : day}
              </div>
            );
          })}
        </div>
      ) : null}

      {canClaimLogin ? (
        <Button variant="primary" className="w-full" isLoading={claiming} onClick={handleClaim}>
          Marcar asistencia hoy
        </Button>
      ) : (
        <p className="text-sm text-text-tertiary">
          Este programa se completa con actividad de tipo {program.activity_type}.
        </p>
      )}

      {program.next_reward?.milestone ? (
        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-tertiary p-3 text-sm text-text-secondary">
          <Gift className="h-4 w-4 shrink-0 text-warning" />
          Próximo hito (día {program.next_reward.next_day_number}):{' '}
          {milestoneLabel(program.next_reward.milestone)}
        </div>
      ) : null}
    </Card>
  );
}

export default function StreakTab() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: streaks, isLoading, error } = useAsyncData(getStreaks, undefined, [refreshKey]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<Flame className="h-8 w-8" />}
        title="No pudimos cargar tu asistencia"
        description="Intentá de nuevo en unos segundos."
      />
    );
  }

  const programs = streaks?.programs ?? [];
  const currentStreak = streaks?.current_streak ?? 0;
  const bestStreak = streaks?.best_streak ?? 0;

  if (programs.length === 0) {
    return (
      <EmptyState
        icon={tabEmptyStates.streak.icon}
        title={tabEmptyStates.streak.title}
        description={tabEmptyStates.streak.description}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="neon" className="card-gradient-surface-streak overflow-hidden">
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-streak">
            <Flame className="h-5 w-5" />
            <span className="text-metadata font-medium uppercase tracking-widest">racha activa</span>
          </div>
          <p className="text-2xl font-semibold">{formatNumber(currentStreak)}</p>
          <p className="text-sm text-text-secondary">días seguidos</p>
          <p className="mt-2 text-sm font-light italic text-text-tertiary">tu mejor racha: {formatNumber(bestStreak)} días</p>
        </div>
      </Card>

      {programs.map((program) => (
        <StreakProgramCard key={program.streak_program_id} program={program} onClaimed={() => setRefreshKey((k) => k + 1)} />
      ))}
    </div>
  );
}
