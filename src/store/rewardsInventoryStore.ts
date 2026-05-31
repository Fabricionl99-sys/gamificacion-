import { create } from 'zustand';

import type { ChestInventoryItem } from '../api/chests';
import type { WheelInventoryItem } from '../api/wheels';

interface RewardsInventoryStore {
  selectedChest: ChestInventoryItem | null;
  selectedWheel: WheelInventoryItem | null;
  setSelectedChest: (item: ChestInventoryItem | null) => void;
  setSelectedWheel: (item: WheelInventoryItem | null) => void;
}

export const useRewardsInventoryStore = create<RewardsInventoryStore>((set) => ({
  selectedChest: null,
  selectedWheel: null,
  setSelectedChest: (item) => set({ selectedChest: item }),
  setSelectedWheel: (item) => set({ selectedWheel: item }),
}));
