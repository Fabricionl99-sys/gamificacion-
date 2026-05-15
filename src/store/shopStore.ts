import { create } from 'zustand';

import type { ShopItem } from '../types/reward';

interface ShopState {
  selectedItem: ShopItem | null;
  setSelectedItem: (item: ShopItem | null) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
