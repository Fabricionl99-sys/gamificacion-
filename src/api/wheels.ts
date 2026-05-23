import { apiClient } from './client';
import { unwrapData } from '../lib/apiResponse';

/** Backend: POST /v1/player/wheels/inventory/:id/spin */
export async function spinWheelInventoryItem(inventoryId: string): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(`/v1/player/wheels/inventory/${inventoryId}/spin`);
  return unwrapData(data);
}
