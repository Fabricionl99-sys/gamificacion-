import { create } from 'zustand';

export type ModalName =
  | 'mysteryBox'
  | 'wheel'
  | 'streakChest'
  | 'scratchCard'
  | 'levelUp'
  | 'purchase'
  | 'shopDetail'
  | 'missionDetail'
  | 'postEditor'
  | 'notifications'
  | 'divisionPrizes'
  | 'tournamentRegister';

export interface ModalsState {
  activeModal: ModalName | null;
  openModal: (modal: ModalName) => void;
  closeModal: () => void;
  resetModals: () => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  resetModals: () => set({ activeModal: null }),
}));
