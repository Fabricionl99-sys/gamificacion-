import { Coins, Settings, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { usePlayer } from '../../hooks/usePlayer';
import { useUiStore } from '../../store/uiStore';
import { getAvatarBackgroundFromName } from '../../utils/avatarHashColor';
import { formatBoostEndClock, formatNumber } from '../../utils/format';
import { resolveLevelDisplayName } from '../../utils/levelDisplay';
import { getPlayerInitials } from '../../utils/playerInitials';
import { resolveXpSegment } from '../../utils/xpLevelSegment';

function formatMultiplierLabel(m: number): string {
  if (Number.isInteger(m)) return `x${m}`;
  return `x${String(m).replace('.', ',')}`;
}

export function WidgetHeader() {
  const { player, isLoading } = usePlayer();
  const { boosts } = useActiveBoosts();
  const setActiveView = useUiStore((state) => state.setActiveView);

  const tiers = player.levelDefinitions ?? [];
  const levelName = resolveLevelDisplayName(player.level, tiers);
  const levelTitle = `${levelName.toUpperCase()} · NIVEL ${player.level}`;

  const initials = getPlayerInitials(player.name);
  const avatarBg = getAvatarBackgroundFromName(player.name);

  const { progressPercent, displayCurrent, displayNext } = resolveXpSegment(player);
  const xpLine = isLoading
    ? 'sincronizando...'
    : `${formatNumber(displayCurrent)} / ${formatNumber(displayNext)} XP`;

  const topBoost =
    boosts.length > 0
      ? boosts.reduce((best, b) => (b.multiplier > best.multiplier ? b : best), boosts[0])
      : null;

  const wallet = player.wallet;
  const primaryCoin = wallet && wallet.length > 0 ? wallet[0] : null;
  const coinAmount = primaryCoin?.balance ?? player.coins ?? 0;

  return (
    <header
      className="rounded-2xl border border-border-default/80 bg-gradient-to-b from-bg-secondary/95 to-bg-primary/90 px-4 py-5 shadow-card md:px-5 md:py-6"
      aria-label="Estado del jugador"
    >
      <div className="flex gap-3 md:gap-4">
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full md:h-20 md:w-20"
          style={{
            background: avatarBg,
            boxShadow: '0 0 0 1px rgba(10, 247, 132, 0.25), 0 0 20px rgba(10, 247, 132, 0.18)',
          }}
          aria-label={player.name ? `Avatar de ${player.name}` : 'Avatar del jugador'}
        >
          {initials ? (
            <span className="font-mono text-lg font-bold leading-none tracking-tight text-white md:text-xl">
              {initials}
            </span>
          ) : (
            <User className="h-8 w-8 text-white/80" strokeWidth={1.75} aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <p className="min-w-0 flex-1 font-urbanist text-base font-semibold uppercase leading-snug tracking-wide text-text-primary md:text-lg">
              {levelTitle}
            </p>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:justify-end">
              {topBoost ? (
                <motion.span
                  className="inline-flex shrink-0 flex-wrap items-center gap-1 font-mono text-sm font-semibold text-accent sm:max-w-[48%] sm:justify-end md:text-[15px]"
                  style={{ textShadow: '0 0 12px rgba(10, 247, 132, 0.45)' }}
                  animate={{ opacity: [1, 0.82, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Zap className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2.5} />
                  <span>
                    {formatMultiplierLabel(topBoost.multiplier)} hasta {formatBoostEndClock(topBoost.ends_at)}
                  </span>
                </motion.span>
              ) : null}
              <button
                type="button"
                className="rounded-full p-1.5 text-text-tertiary transition hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => setActiveView('settings')}
                aria-label="Abrir configuracion"
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <p className="mt-2 font-mono text-[13px] text-text-primary/70 md:text-sm">{xpLine}</p>

          <div className="mt-3 space-y-2 pl-0">
            <div
              className="h-2 overflow-hidden rounded-full bg-white/[0.1] md:h-2.5"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
              aria-label="Progreso de XP al siguiente nivel"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent via-[#2cff9c] to-[#7dffc4] transition-[width] duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-text-primary md:text-base">
                {primaryCoin?.imageUrl ? (
                  <img src={primaryCoin.imageUrl} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
                ) : (
                  <Coins className="h-5 w-5 shrink-0 text-coins" aria-hidden strokeWidth={2} />
                )}
                <span>{formatNumber(coinAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
