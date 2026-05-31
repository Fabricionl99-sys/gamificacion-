import { getPlayer } from '../api/player';
import { mockPlayer } from '../mocks';
import { EMPTY_PLAYER, isProductionWidget } from '../lib/emptyPlayer';
import { usePlayerStore } from '../store/playerStore';
import { useAsyncData } from './useAsyncData';

export const usePlayer = () => {
  const storedPlayer = usePlayerStore((state) => state.player);
  const claimPrize = usePlayerStore((state) => state.claimPrize);
  const fallback = isProductionWidget() ? EMPTY_PLAYER : mockPlayer;
  const { data, isLoading, error } = useAsyncData(getPlayer, undefined);
  const base = data ?? (isLoading ? fallback : fallback);

  const player = {
    ...base,
    avatar: storedPlayer.avatar || base.avatar,
    pendingPrizes: storedPlayer.pendingPrizes ?? base.pendingPrizes,
    unreadNotifications: storedPlayer.unreadNotifications ?? base.unreadNotifications,
    wallet: storedPlayer.wallet?.length ? storedPlayer.wallet : base.wallet,
  };

  return {
    player,
    isLoading,
    error,
    claimPrize,
  };
};
