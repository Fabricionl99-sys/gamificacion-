import { create } from 'zustand';

interface MissionsState {
  refreshToken: number;
  bumpRefresh: () => void;
}

export const useMissionsStore = create<MissionsState>((set) => ({
  refreshToken: 0,
  bumpRefresh: () => set((state) => ({ refreshToken: state.refreshToken + 1 })),
}));
