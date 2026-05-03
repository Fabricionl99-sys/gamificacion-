import { Flame, Lock, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SectionHeader } from '../shared/SectionHeader';
import { usePlayer } from '../../hooks/usePlayer';
import { cn } from '../../utils/classnames';

const days = Array.from({ length: 14 }, (_, index) => index + 1);

export default function StreakTab() {
  const { player } = usePlayer();

  return (
    <div className="space-y-4">
      <Card variant="neon" className="overflow-hidden bg-streak-hero">
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-streak">
            <Flame className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-widest">racha activa</span>
          </div>
          <p className="text-2xl font-semibold">{player.streak}</p>
          <p className="text-sm text-text-secondary">dias seguidos</p>
          <p className="mt-2 text-sm font-light italic text-text-tertiary">tu mejor racha: {player.bestStreak} dias</p>
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionHeader title="ultimos 14 dias" description="el dia actual queda marcado con borde verde" />
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const completed = day <= player.streak;
            const today = day === player.streak;
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

      <section className="space-y-3">
        <SectionHeader title="proximos cofres" description="recompensas por sostener asistencia diaria" />
        {[
          ['Cofre corto', 'en 3 dias', 'borde ambar, urgencia visual'],
          ['Cofre medio', 'en 18 dias', 'bono neutral + XP'],
          ['Cofre legendario', 'en 88 dias', 'a la distancia'],
        ].map(([title, time, detail], index) => (
          <Card key={title} className={index === 2 ? 'bg-legendary-chest' : undefined}>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-bg-tertiary text-warning">
                {index === 2 ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-text-tertiary">{detail}</p>
              </div>
              <Badge variant={index === 0 ? 'warning' : 'neutral'}>{time}</Badge>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
