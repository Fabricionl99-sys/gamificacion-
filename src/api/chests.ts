import { getJson } from './fetchJson';

export type ChestInventoryItem = {
  id: string;
  chest_type_id?: string;
  chest_type_code?: string;
  name?: string;
  title?: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | string;
  image_url?: string | null;
  quantity?: number;
  status?: string;
};

/** GET /v1/player/chests/inventory — cofres del jugador listos para abrir. */
export async function getChestInventory(): Promise<ChestInventoryItem[]> {
  try {
    const data = await getJson<ChestInventoryItem[] | { items?: ChestInventoryItem[] }>(
      '/v1/player/chests/inventory',
    );
    if (Array.isArray(data)) return data;
    return data.items ?? [];
  } catch (e) {
    if (isNotFound(e)) return [];
    throw e;
  }
}

function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404;
}
