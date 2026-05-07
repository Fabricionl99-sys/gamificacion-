import { ProgressBar } from '../ui/ProgressBar';
import { formatNumber } from '../../utils/format';

type Props = {
  displayName: string;
  level: number;
  badgeUrl?: string;
  currentXP: number;
  nextLevelXP: number;
  isLoading?: boolean;
  xpProgressPercent: number;
};

/** Bloque de estado de nivel en el header (insignia heredada + nombre + barra). */
export function LevelBadge({
  displayName,
  level,
  badgeUrl,
  currentXP,
  nextLevelXP,
  isLoading,
  xpProgressPercent,
}: Props) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        {badgeUrl ? (
          <img src={badgeUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg border border-border-subtle object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="truncate text-sm font-semibold text-text-primary">{displayName}</span>
            <span className="text-xs font-medium text-text-tertiary">· Nivel {level}</span>
          </div>
          <span className="mt-0.5 block truncate text-xs text-text-tertiary">
            {isLoading ? 'sincronizando...' : `${formatNumber(currentXP)} / ${formatNumber(nextLevelXP)} XP`}
          </span>
        </div>
      </div>
      <ProgressBar value={xpProgressPercent} ariaLabel="Progreso de XP al siguiente nivel" />
    </>
  );
}
