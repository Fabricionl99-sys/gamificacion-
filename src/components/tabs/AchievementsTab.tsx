import { useMemo, useState } from 'react';
import { Award, CheckCircle2, HelpCircle, Lock, Star, Trophy } from 'lucide-react';

import { getAchievements } from '../../api/achievements';
import { useAsyncData } from '../../hooks/useAsyncData';
import type { Achievement, AchievementTier } from '../../types/achievement';
import { formatNumber, getProgressPercent } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';

const tierFilters = ['all', 'bronze', 'silver', 'gold', 'platinum', 'diamond'] as const;
const tierLabels: Record<AchievementTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

const statusLabel = {
  unlocked: 'desbloqueado',
  in_progress: 'en progreso',
  locked: 'bloqueado',
  secret: 'secreto',
};

function rewardLabel(achievement: Achievement) {
  const parts = [`+${formatNumber(achievement.reward.xp)} XP`];
  if (achievement.reward.coins) parts.push(`+${formatNumber(achievement.reward.coins)} monedas`);
  if (achievement.reward.chest_id) parts.push('cofre');
  return parts.join(' · ');
}

function AchievementCard({ achievement, onSelect }: { achievement: Achievement; onSelect: (achievement: Achievement) => void }) {
  const unlocked = achievement.status === 'unlocked';
  const progress = achievement.progress ? getProgressPercent(achievement.progress.current, achievement.progress.total) : 0;

  return (
    <button type="button" onClick={() => onSelect(achievement)} className="text-left">
      <Card className={unlocked ? 'border-coins/50 bg-coins/10' : achievement.status === 'secret' ? 'opacity-70' : undefined}>
        <div className="flex items-start justify-between gap-2">
          <div className="text-2xl">{achievement.status === 'secret' ? <HelpCircle className="h-8 w-8 text-text-tertiary" /> : achievement.icon}</div>
          <Badge tone={unlocked ? 'vip' : achievement.status === 'in_progress' ? 'info' : 'neutral'}>
            {unlocked ? <CheckCircle2 className="h-3 w-3" /> : achievement.status === 'locked' ? <Lock className="h-3 w-3" /> : null}
            {tierLabels[achievement.tier]}
          </Badge>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-text-primary">{achievement.status === 'secret' ? 'Logro secreto' : achievement.name}</h3>
        <p className="mt-1 min-h-10 text-xs text-text-secondary">{achievement.status === 'secret' ? '?????' : achievement.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-text-tertiary">
          <span>{statusLabel[achievement.status]}</span>
          <span>{rewardLabel(achievement)}</span>
        </div>
        {achievement.status === 'in_progress' && achievement.progress ? (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] text-text-tertiary">
              <span>
                {achievement.progress.current}/{achievement.progress.total}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        ) : null}
      </Card>
    </button>
  );
}

function AchievementDetailModal({ achievement, onClose }: { achievement: Achievement | null; onClose: () => void }) {
  if (!achievement) return null;
  const remaining = achievement.progress ? Math.max(0, achievement.progress.total - achievement.progress.current) : 0;

  return (
    <Modal isOpen onClose={onClose} title={achievement.status === 'secret' ? 'Logro secreto' : achievement.name} description={achievement.description}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-bg-tertiary text-4xl">
            {achievement.status === 'secret' ? <HelpCircle className="h-10 w-10 text-text-tertiary" /> : achievement.icon}
          </div>
          <div>
            <Badge tone="vip">{tierLabels[achievement.tier]}</Badge>
            <p className="mt-2 text-sm text-text-secondary">Recompensa: {rewardLabel(achievement)}</p>
          </div>
        </div>
        {achievement.status === 'unlocked' ? <Card className="text-sm text-success">Conseguido el {new Date(achievement.unlocked_at ?? '').toLocaleDateString('es-AR')}</Card> : null}
        {achievement.status === 'in_progress' && achievement.progress ? (
          <Card className="space-y-3">
            <p className="text-sm text-text-secondary">Te falta {remaining} para conseguirlo</p>
            <ProgressBar value={getProgressPercent(achievement.progress.current, achievement.progress.total)} />
          </Card>
        ) : null}
        {achievement.status === 'secret' ? <Card className="text-sm text-text-secondary">Pista: {achievement.hint ?? 'seguí jugando para descubrirlo'}</Card> : null}
        <Button className="w-full" variant="primary" onClick={onClose}>
          cerrar
        </Button>
      </div>
    </Modal>
  );
}

export default function AchievementsTab() {
  const { data: achievements = [], isLoading, error } = useAsyncData(getAchievements, []);
  const [filter, setFilter] = useState<(typeof tierFilters)[number]>('all');
  const [selected, setSelected] = useState<Achievement | null>(null);
  const filtered = filter === 'all' ? achievements : achievements.filter((achievement) => achievement.tier === filter);
  const unlocked = achievements.filter((achievement) => achievement.status === 'unlocked');
  const xpEarned = unlocked.reduce((total, achievement) => total + achievement.reward.xp, 0);
  const nextAchievement = achievements.find((achievement) => achievement.status === 'in_progress');

  const nextProgress = useMemo(() => {
    if (!nextAchievement?.progress) return 0;
    return getProgressPercent(nextAchievement.progress.current, nextAchievement.progress.total);
  }, [nextAchievement]);

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <EmptyState icon={<Award className="h-8 w-8" />} title="No pudimos cargar logros" description="Intentá de nuevo en unos segundos." />;

  return (
    <div className="space-y-4">
      <SectionIntro />
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <p className="text-xs text-text-tertiary">desbloqueados</p>
          <p className="mt-1 text-lg font-semibold">
            {unlocked.length} / {achievements.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">XP ganado</p>
          <p className="mt-1 text-lg font-semibold text-accent">{formatNumber(xpEarned)}</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">próximo</p>
          <p className="mt-1 truncate text-sm font-semibold">{nextAchievement?.name ?? 'sin pendientes'}</p>
        </Card>
      </div>
      {nextAchievement?.progress ? (
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Star className="h-4 w-4 text-accent" />
            Próximo logro · {nextAchievement.name}
          </div>
          <ProgressBar value={nextProgress} />
        </Card>
      ) : null}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tierFilters.map((tier) => (
          <Button key={tier} size="sm" variant={filter === tier ? 'primary' : 'secondary'} onClick={() => setFilter(tier)}>
            {tier === 'all' ? 'Todos' : tierLabels[tier]}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {filtered.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} onSelect={setSelected} />
        ))}
      </div>
      <AchievementDetailModal achievement={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SectionIntro() {
  return (
    <Card variant="neon" className="scan-effect">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-coins/15 text-coins">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">Logros</p>
          <h2 className="text-lg font-semibold text-text-primary">desbloqueá insignias jugando</h2>
        </div>
      </div>
    </Card>
  );
}
