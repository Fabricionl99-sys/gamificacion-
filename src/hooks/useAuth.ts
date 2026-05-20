import { getTenantIdFromUrl } from '../lib/demoTenant';
import { mockPlayer } from '../mocks';

interface UseAuthResult {
  playerId: string;
  tenantId: string;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthResult => ({
  playerId: mockPlayer.id,
  tenantId: getTenantIdFromUrl(),
  isAuthenticated: true,
});
