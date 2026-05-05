import { Bell, ChevronRight, Flame, Gift, Settings, Sparkles } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Pill } from '../ui/Pill';
import { ProgressBar } from '../ui/ProgressBar';
import { BoostBadge } from '../boost/BoostBadge';
import { usePlayer } from '../../hooks/usePlayer';
import { useModalsStore } from '../../store/modalsStore';
import { useUiStore } from '../../store/uiStore';
import { formatNumber } from '../../utils/format';

export function WidgetHeader() {
  const { player, isLoading } = usePlayer();
  const openModal = useModalsStore((state) => state.openModal);
  const setActiveView = useUiStore((state) => state.setActiveView);
  const xpProgress = (player.currentXP / player.nextLevelXP) * 100;

  return (
    <header className="card-glass sticky top-0 z-30 rounded-2xl p-3 shadow-card" aria-label="Estado del jugador">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setActiveView('own-profile')}
          aria-label="Abrir perfil propio"
        >
          <Avatar initials={player.avatar} size="lg" status="online" />
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setActiveView('own-profile')}
        >
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-text-primary">Nivel {player.level}</span>
            <span className="truncate text-xs text-text-tertiary">
              {isLoading ? 'sincronizando...' : `${formatNumber(player.currentXP)} / ${formatNumber(player.nextLevelXP)} XP`}
            </span>
          </div>
          <ProgressBar value={xpProgress} ariaLabel="Progreso de XP al siguiente nivel" />
          <BoostBadge />
        </button>

        <div className="hidden shrink-0 items-center gap-2 xs:flex">
          <Pill icon={<Flame className="h-3 w-3 text-streak" />} label={formatNumber(player.streak)} />
          <Pill icon={<Sparkles className="h-3 w-3 text-coins" />} label={formatNumber(player.coins)} />
        </div>

        <button
          type="button"
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary transition-transform hover:-translate-y-0.5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setActiveView('own-profile')}
          aria-label={`${player.pendingPrizes} premios pendientes`}
        >
          <Gift className="h-4 w-4" />
          {player.pendingPrizes > 0 ? (
            <span className="notification-badge absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-semibold text-white">
              {player.pendingPrizes}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary transition-transform hover:-translate-y-0.5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => openModal('notifications')}
          aria-label={`${player.unreadNotifications} notificaciones sin leer`}
        >
          <Bell className="h-4 w-4" />
          {player.unreadNotifications > 0 ? (
            <span className="notification-badge absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-semibold text-white">
              {player.unreadNotifications}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary transition-transform hover:-translate-y-0.5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:flex"
          onClick={() => setActiveView('settings')}
          aria-label="Abrir configuracion"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between pl-[50px] xs:hidden">
        <div className="flex gap-2">
          <Pill icon={<Flame className="h-3 w-3 text-streak" />} label={formatNumber(player.streak)} />
          <Pill icon={<Sparkles className="h-3 w-3 text-coins" />} label={formatNumber(player.coins)} />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-1 h-auto px-0 pl-[50px] text-xs font-semibold text-accent hover:bg-transparent"
        onClick={() => setActiveView('own-profile')}
        rightIcon={<ChevronRight className="h-3 w-3" />}
      >
        ver perfil
      </Button>
    </header>
  );
}
