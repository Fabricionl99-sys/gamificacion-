import { create } from 'zustand';

import { createDemoSession, resetDemoSession, type DemoSession } from '../api/demoSession';
import { resolveDemoMintCurrencyCode } from '../lib/demoCurrency';
import { getTenantIdFromUrl } from '../lib/demoTenant';
import {
  clearDemoSession,
  getStoredDemoAccessToken,
  getStoredDemoPlayerId,
  persistDemoCurrencyCode,
  persistDemoSession,
} from '../lib/demoSessionStorage';

interface AuthState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  playerId: string | null;
  tenantId: string | null;
  currencyCode: string | null;
  error: string | null;
  ensureSession: () => Promise<void>;
  clearSession: () => void;
  startNewDemoPlayer: () => Promise<DemoSession>;
}

function applyDemoSession(session: DemoSession): Pick<AuthState, 'status' | 'playerId' | 'tenantId' | 'currencyCode' | 'error'> {
  persistDemoSession(session.player_id, session.access_token);
  if (session.currency_code) persistDemoCurrencyCode(session.currency_code);
  return {
    status: 'ready',
    playerId: session.player_id,
    tenantId: session.tenant_id ?? null,
    currencyCode: session.currency_code ?? null,
    error: null,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  playerId: null,
  tenantId: null,
  currencyCode: null,
  error: null,
  ensureSession: async () => {
    set({ status: 'loading', error: null });
    try {
      const existing = getStoredDemoPlayerId();
      const session = await createDemoSession({
        tenant_id: getTenantIdFromUrl(),
        existing_player_id: existing,
        currency_code: resolveDemoMintCurrencyCode(),
      });
      set(applyDemoSession(session));
    } catch (e) {
      clearDemoSession();
      set({
        status: 'error',
        error: e instanceof Error ? e.message : 'No se pudo iniciar la sesión demo',
        playerId: null,
        tenantId: null,
        currencyCode: null,
      });
    }
  },
  clearSession: () => {
    clearDemoSession();
    set({ status: 'idle', playerId: null, tenantId: null, currencyCode: null, error: null });
  },
  startNewDemoPlayer: async () => {
    clearDemoSession();
    set({ status: 'loading', error: null, playerId: null, tenantId: null, currencyCode: null });
    const session = await resetDemoSession({
      tenant_id: getTenantIdFromUrl(),
      currency_code: resolveDemoMintCurrencyCode(),
    });
    set(applyDemoSession(session));
    return session;
  },
}));

export function isDemoAuthReady(): boolean {
  return Boolean(getStoredDemoAccessToken());
}
