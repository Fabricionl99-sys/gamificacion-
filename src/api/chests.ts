import { getJson, postJson } from './fetchJson';
import type { ChestVisualStyle } from '../lib/chestDesigns';
import { normalizeChestOpenResult, type ChestOpenResult } from '../lib/chestPrizes';

export type ChestInventoryItem = {
  id: string;
  chest_type_id?: string;
  chest_type_code?: string;
  name?: string;
  title?: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | string;
  /** Skin futurista — neon | quantum | obsidian | holo | plasma */
  visual_style?: ChestVisualStyle | string | null;
  image_url?: string | null;
  quantity?: number;
  status?: string;
  expires_at?: string | null;
  opened_at?: string | null;
  expired_at?: string | null;
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

/** POST /v1/player/chests/:id/open — el server elige el premio antes de animar. */
export async function openChestInventoryItem(chestId: string): Promise<ChestOpenResult> {
  const data = await postJson<unknown>(`/v1/player/chests/${chestId}/open`, {});
  return normalizeChestOpenResult(data);
}
