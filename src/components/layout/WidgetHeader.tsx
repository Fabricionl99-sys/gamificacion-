import { Bell, ChevronRight, Coins, Gift, User, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { usePlayer } from '../../hooks/usePlayer';
import { usePlayerAvatarDisplay } from '../../hooks/usePlayerAvatarDisplay';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { getAvatarBackgroundFromName } from '../../utils/avatarHashColor';
import { formatBoostEndClock, formatNumber } from '../../utils/format';
import { resolveLevelDisplayName } from '../../utils/levelDisplay';
import { resolveXpSegment } from '../../utils/xpLevelSegment';
import { DemoResetButton } from '../DemoResetButton';
import { useBrandingStore } from '../../store/brandingStore';
import { useModalsStore } from '../../store/modalsStore';
import { usePlayerNotificationsSync } from '../../hooks/usePlayerNotifications';
import { selectUnreadNotificationCount, useNotificationsStore } from '../../store/notificationsStore';

function formatMultiplierLabel(m: number): string {
  if (Number.isInteger(m)) return `x${m}`;
  return `x${String(m).replace('.', ',')}`;
}

/** Placeholder: conectar con panel de premios pendientes. */
function handlePendingPrizesClick(): void {
  /* intentionally empty */
}

/** Abre el centro de notificaciones in-app. */
function useNotificationHeaderActions() {
  const openModal = useModalsStore((state) => state.openModal);
  const refresh = useNotificationsStore((state) => state.refresh);
  const unreadCount = useNotificationsStore(selectUnreadNotificationCount);
  usePlayerNotificationsSync();

  return {
    unreadCount,
    openNotifications: () => {
      openModal('notifications');
      void refresh();
    },
  };
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
      <AnimatePresence>
        {count > 0 ? (
          <motion.span
            key="notification-badge"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 28 }}
            className="pointer-events-none absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold leading-none text-white shadow-sm"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

export function WidgetHeader() {
  const { player, isLoading } = usePlayer();
  const { imageUrl: avatarImageUrl, initials } = usePlayerAvatarDisplay();
  const { boosts } = useActiveBoosts();
  const { navigateToProfile } = useWidgetNavigation();
  const { unreadCount, openNotifications } = useNotificationHeaderActions();

  const tiers = player.levelDefinitions ?? [];
  const levelName = resolveLevelDisplayName(player.level, tiers);
  const levelLabel = useBrandingStore((s) => s.config?.level_label) ?? document.documentElement.dataset.levelLabel ?? 'Nivel';
  const levelTitle = `${levelName.toUpperCase()} · ${levelLabel.toUpperCase()} ${player.level}`;

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
      className="relative rounded-2xl border border-border-default/80 px-4 py-3 shadow-card md:px-5 md:py-4"
      style={{ background: 'var(--profile-card-bg, var(--bg-secondary))' }}
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
          count={unreadCount}
          ariaLabel={`Notificaciones sin leer (${unreadCount})`}
          onPress={openNotifications}
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
            {avatarImageUrl ? (
              <img
                alt={player.name ? `Avatar de ${player.name}` : 'Avatar del jugador'}
                className="h-full w-full rounded-full object-cover"
                src={avatarImageUrl}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.parentElement
                    ?.querySelector('[data-avatar-fallback]')
                    ?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span
              data-avatar-fallback
              className={`font-mono text-lg font-bold leading-none tracking-tight text-white md:text-xl ${avatarImageUrl ? 'hidden' : ''}`}
            >
              {initials || null}
            </span>
            {!initials && !avatarImageUrl ? (
              <User className="h-8 w-8 text-white/80" strokeWidth={1.75} aria-hidden />
            ) : null}
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
              className="h-2 overflow-hidden rounded-full md:h-2.5"
              style={{ background: 'var(--progress-track, rgba(255,255,255,0.1))' }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
              aria-label="Progreso de XP al siguiente nivel"
            >
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: 'var(--progress-fill, var(--accent-primary))',
                }}
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
