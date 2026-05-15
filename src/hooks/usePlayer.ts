import { getPlayer } from '../api/player';
import { mockPlayer } from '../mocks';
import { usePlayerStore } from '../store/playerStore';
import { useAsyncData } from './useAsyncData';

export const usePlayer = () => {
  const storedPlayer = usePlayerStore((state) => state.player);
  const claimPrize = usePlayerStore((state) => state.claimPrize);
  const { data, isLoading, error } = useAsyncData(getPlayer, storedPlayer ?? mockPlayer);
  const base = data ?? mockPlayer;
  const player = {
    ...base,
    avatar: storedPlayer.avatar,
    pendingPrizes: storedPlayer.pendingPrizes,
    unreadNotifications: storedPlayer.unreadNotifications,
    wallet: storedPlayer.wallet ?? base.wallet,
  };

  return {
    player,
    isLoading,
    error,
    claimPrize,
  };
};
