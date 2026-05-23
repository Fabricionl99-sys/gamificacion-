import { Bell, ChevronRight, Coins, Gift, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { usePlayer } from '../../hooks/usePlayer';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { getAvatarBackgroundFromName } from '../../utils/avatarHashColor';
import { formatBoostEndClock, formatNumber } from '../../utils/format';
import { resolveLevelDisplayName } from '../../utils/levelDisplay';
import { getPlayerInitials } from '../../utils/playerInitials';
import { resolveXpSegment } from '../../utils/xpLevelSegment';
import { DemoResetButton } from '../DemoResetButton';

function formatMultiplierLabel(m: number): string {
  if (Number.isInteger(m)) return `x${m}`;
  return `x${String(m).replace('.', ',')}`;
}

/** Placeholder: conectar con panel de premios pendientes. */
function handlePendingPrizesClick(): void {
  /* intentionally empty */
}

/** Placeholder: conectar con centro de notificaciones. */
function handleNotificationsClick(): void {
  /* intentionally empty */
}


function HeaderIconWithBadge({
  icon: Icon,
  count,
  ariaLabel,
  onPress,
}: {
  icon: typeof Gift;
  count: number;
  ariaLabel: string;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={ariaLabel}
      onClick={onPress}
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      {count > 0 ? (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold leading-none text-white shadow-sm">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  );
}

export function WidgetHeader() {
  const { player, isLoading } = usePlayer();
  const { boosts } = useActiveBoosts();
  const { navigateToProfile } = useWidgetNavigation();

  const tiers = player.levelDefinitions ?? [];
  const levelName = resolveLevelDisplayName(player.level, tiers);
  const levelTitle = `${levelName.toUpperCase()} · NIVEL ${player.level}`;

  const initials = (player.avatar?.trim() || getPlayerInitials(player.name)).slice(0, 2);
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
      className="relative rounded-2xl border border-border-default/80 bg-gradient-to-b from-bg-secondary/95 to-bg-primary/90 px-4 py-3 shadow-card md:px-5 md:py-4"
      aria-label="Estado del jugador"
    >
      <div className="absolute right-3 top-2 z-10 flex items-center gap-0.5 md:right-4 md:top-2.5">
        <HeaderIconWithBadge
          icon={Gift}
          count={player.pendingPrizes}
          ariaLabel={`Premios pendientes (${player.pendingPrizes})`}
          onPress={handlePendingPrizesClick}
        />
        <HeaderIconWithBadge
          icon={Bell}
          count={player.unreadNotifications}
          ariaLabel={`Notificaciones sin leer (${player.unreadNotifications})`}
          onPress={handleNotificationsClick}
        />
      </div>

      <div className="flex items-stretch gap-3 md:gap-3.5">
        <div className="flex shrink-0 flex-col justify-between">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
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
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-0.5 self-start whitespace-nowrap font-urbanist text-base font-semibold leading-none text-white/85 transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-[17px]"
            onClick={() => navigateToProfile()}
          >
            Mi perfil
            <ChevronRight className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90" aria-hidden strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-w-0 flex-1 pr-[4.25rem] md:pr-[4.5rem]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <p className="min-w-0 flex-1 font-urbanist text-base font-semibold uppercase leading-snug tracking-wide text-text-primary md:text-lg">
              {levelTitle}
            </p>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:justify-end">
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
            </div>
          </div>

          <p className="mt-1 font-mono text-[13px] text-text-primary/70 md:text-sm">{xpLine}</p>

          <div className="mt-1.5">
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
            <div className="mt-1.5 flex justify-end pr-0.5">
              <div className="inline-flex max-w-full items-center gap-1.5 font-mono text-sm font-bold text-text-primary md:text-base">
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
      <div className="mt-2 flex justify-end border-t border-border-default/40 pt-2">
        <DemoResetButton />
      </div>
    </header>
  );
}
