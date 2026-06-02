import { getJson, postJson } from './fetchJson';

export type WheelInventoryItem = {
  id: string;
  wheel_id?: string;
  name?: string;
  title?: string;
  description?: string;
  cost_label?: string;
  spins_remaining?: number;
  image_url?: string | null;
  expires_at?: string | null;
};

export async function getWheelsInventory(): Promise<WheelInventoryItem[]> {
  try {
    const data = await getJson<WheelInventoryItem[] | { items?: WheelInventoryItem[] }>(
      '/v1/player/wheels/inventory',
    );
    if (Array.isArray(data)) return data;
    return data.items ?? [];
  } catch {
    return [];
  }
}

/** POST /v1/player/wheels/inventory/:id/spin */
export async function spinWheelInventoryItem(inventoryId: string): Promise<unknown> {
  return postJson(`/v1/player/wheels/inventory/${inventoryId}/spin`);
}
