import { create } from 'zustand';

import type { Tournament } from '../types/tournament';

interface TournamentsStore {
  selected: Tournament | null;
  setSelected: (tournament: Tournament | null) => void;
}

export const useTournamentsStore = create<TournamentsStore>((set) => ({
  selected: null,
  setSelected: (tournament) => set({ selected: tournament }),
}));
