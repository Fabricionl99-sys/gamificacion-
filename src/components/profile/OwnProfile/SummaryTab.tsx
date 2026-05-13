import { Flame, WalletCards } from 'lucide-react';
import { Card } from '../../ui/Card';
import { ProgressBar } from '../../ui/ProgressBar';
import { usePlayer } from '../../../hooks/usePlayer';
import { formatNumber } from '../../../utils/format';

export function SummaryTab() {
  const { player } = usePlayer();

  return (
    <div className="space-y-3">
      <Card variant="glass">
        <p className="text-sm font-medium text-text-secondary">progreso al siguiente nivel</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-text-primary">Nivel {player.level}</span>
          <span className="text-xs text-text-tertiary">
            {formatNumber(player.currentXP)} / {formatNumber(player.nextLevelXP)} XP
          </span>
        </div>
        <ProgressBar className="mt-3" value={(player.currentXP / player.nextLevelXP) * 100} />
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Flame, value: player.streak, label: 'racha' },
          { icon: WalletCards, value: player.coins, label: 'monedas' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
          <Card key={stat.label} className="text-center">
            <Icon className="mx-auto mb-2 h-4 w-4 text-text-tertiary" />
            <p className="text-lg font-semibold text-text-primary">{formatNumber(Number(stat.value))}</p>
            <p className="text-xs text-text-tertiary">{stat.label}</p>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
