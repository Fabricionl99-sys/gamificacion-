import { getTenantIdFromUrl } from '../lib/demoTenant';
import { isDemoAuthReady } from '../store/authStore';
import { mockPlayer } from '../mocks';

interface UseAuthResult {
  playerId: string;
  tenantId: string;
  isAuthenticated: boolean;
}

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export const useAuth = (): UseAuthResult => {
  const tenantId = getTenantIdFromUrl();
  if (useMocks) {
    return {
      playerId: mockPlayer.id,
      tenantId,
      isAuthenticated: true,
    };
  }
  const storedPlayerId = typeof window !== 'undefined' ? sessionStorage.getItem('s2g_demo_player_id') : null;
  return {
    playerId: storedPlayerId ?? '',
    tenantId,
    isAuthenticated: isDemoAuthReady(),
  };
};
