import { usePlayerStore } from '../store/playerStore';

export const usePlayer = () => ({
  player: usePlayerStore((state) => state.player),
  claimPrize: usePlayerStore((state) => state.claimPrize),
});
