import { create } from 'zustand';

import { createDemoSession } from '../api/demoSession';
import {
  clearDemoSession,
  getStoredDemoAccessToken,
  getStoredDemoPlayerId,
  persistDemoSession,
} from '../lib/demoSessionStorage';

interface AuthState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  playerId: string | null;
  tenantId: string | null;
  error: string | null;
  ensureSession: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  playerId: null,
  tenantId: null,
  error: null,
  ensureSession: async () => {
    set({ status: 'loading', error: null });
    try {
      const existing = getStoredDemoPlayerId();
      const session = await createDemoSession(existing);
      persistDemoSession(session.player_id, session.access_token);
      set({
        status: 'ready',
        playerId: session.player_id,
        tenantId: session.tenant_id,
        error: null,
      });
    } catch (e) {
      clearDemoSession();
      set({
        status: 'error',
        error: e instanceof Error ? e.message : 'No se pudo iniciar la sesión demo',
      });
    }
  },
  clearSession: () => {
    clearDemoSession();
    set({ status: 'idle', playerId: null, tenantId: null, error: null });
  },
}));

export function isDemoAuthReady(): boolean {
  return Boolean(getStoredDemoAccessToken());
}
