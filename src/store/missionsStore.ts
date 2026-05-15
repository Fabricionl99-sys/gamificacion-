import { create } from 'zustand';

import type { Mission } from '../types/mission';

interface MissionsState {
  refreshToken: number;
  bumpRefresh: () => void;
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
}

export const useMissionsStore = create<MissionsState>((set) => ({
  refreshToken: 0,
  bumpRefresh: () => set((state) => ({ refreshToken: state.refreshToken + 1 })),
  selectedMission: null,
  setSelectedMission: (mission) => set({ selectedMission: mission }),
}));
