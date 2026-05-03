import { create } from 'zustand';

export type ModalName =
  | 'mysteryBox'
  | 'wheel'
  | 'streakChest'
  | 'scratchCard'
  | 'levelUp'
  | 'purchase'
  | 'postEditor'
  | 'notifications'
  | 'divisionPrizes'
  | 'tournamentRegister';

interface ModalsState {
  activeModal: ModalName | null;
  openModal: (modal: ModalName) => void;
  closeModal: () => void;
}

export const useModalsStore = create<ModalsState>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));
