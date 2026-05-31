import { Flame, Lock, Trophy } from 'lucide-react';

import { getStreaks } from '../../api/streaks';
import { useAsyncData } from '../../hooks/useAsyncData';
import { usePlayer } from '../../hooks/usePlayer';
import { cn } from '../../utils/classnames';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';

const days = Array.from({ length: 14 }, (_, index) => index + 1);

export default function StreakTab() {
  const { player } = usePlayer();
  const { data: streaks, isLoading, error } = useAsyncData(getStreaks, undefined);

  const currentStreak = streaks?.current_streak ?? player.streak;
  const bestStreak = streaks?.best_streak ?? player.bestStreak;
  const programs = streaks?.programs ?? [];

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
        title="No pudimos cargar tu racha"
        description="Intentá de nuevo en unos segundos."
      />
    );
  }

  if (programs.length === 0 && currentStreak === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={<Flame className="h-8 w-8" />}
          title="Aún no hay programas de racha"
          description="El operador no configuró asistencia diaria todavía."
        />
      </div>
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
          <p className="text-2xl font-semibold">{currentStreak}</p>
          <p className="text-sm text-text-secondary">dias seguidos</p>
          <p className="mt-2 text-sm font-light italic text-text-tertiary">tu mejor racha: {bestStreak} dias</p>
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionHeader title="ultimos 14 dias" description="el dia actual queda marcado con borde verde" />
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const completed = day <= currentStreak;
            const today = day === currentStreak;
            return (
              <div
                key={day}
                className={cn(
                  'grid aspect-square place-items-center rounded-md border text-xs font-semibold',
                  completed
                    ? 'border-streak/40 bg-streak/15 text-streak'
                    : 'border-dashed border-border-default bg-bg-tertiary text-text-tertiary',
                  today && 'outline outline-2 outline-accent',
                )}
              >
                {completed ? <Flame className="h-4 w-4" /> : day}
              </div>
            );
          })}
        </div>
        <Button variant="ghost" className="w-full justify-between">
          ver mes completo
          <span aria-hidden="true">→</span>
        </Button>
      </Card>

      {programs.length > 0 ? (
        <section className="space-y-3">
          <SectionHeader title="programas de racha" description="recompensas por sostener asistencia diaria" />
          {programs.map((program, index) => (
            <Card key={program.id} className={index === programs.length - 1 ? 'bg-legendary-chest' : undefined}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-bg-tertiary text-warning">
                  {program.next_reward_at_day ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{program.name}</p>
                  {program.description ? (
                    <p className="text-sm text-text-tertiary">{program.description}</p>
                  ) : null}
                </div>
                {program.next_reward_at_day ? (
                  <Badge variant="warning">en {program.next_reward_at_day} dias</Badge>
                ) : null}
              </div>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}
