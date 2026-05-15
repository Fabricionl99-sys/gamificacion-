import { create } from 'zustand';

import { mockPlayer } from '../mocks';
import type { Player } from '../types/player';

interface PlayerStore {
  player: Player;
  claimPrize: () => void;
  resetPlayer: () => void;
  updatePlayer: (partial: Partial<Player>) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: mockPlayer,
  claimPrize: () =>
    set((state) => ({
      player: {
        ...state.player,
        pendingPrizes: Math.max(0, state.player.pendingPrizes - 1),
      },
    })),
  resetPlayer: () => set({ player: mockPlayer }),
  updatePlayer: (partial) =>
    set((state) => ({
      player: { ...state.player, ...partial },
    })),
}));
