import { create } from 'zustand';

export interface ToastInput {
  tone?: 'success' | 'danger' | 'info';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastMessage extends ToastInput {
  id: string;
}

interface ToastState {
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
  pushToast: (input: ToastInput) => void;
  success: (message: string) => void;
  danger: (message: string, actionLabel?: string, onAction?: () => void) => void;
  info: (message: string) => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  pushToast: (input) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          tone: input.tone ?? 'info',
          message: input.message,
          actionLabel: input.actionLabel,
          onAction: input.onAction,
        },
      ],
    }));
    window.setTimeout(() => get().dismiss(id), 4200);
  },
  success: (message) => get().pushToast({ message, tone: 'success' }),
  danger: (message, actionLabel, onAction) => get().pushToast({ message, tone: 'danger', actionLabel, onAction }),
  info: (message) => get().pushToast({ message, tone: 'info' }),
}));
