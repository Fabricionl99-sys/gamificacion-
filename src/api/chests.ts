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
    const data = await getJson<unknown>('/v1/player/chests/inventory');
    return extractChestInventoryItems(data);
  } catch {
    return [];
  }
}

function extractChestInventoryItems(data: unknown): ChestInventoryItem[] {
  if (Array.isArray(data)) return data as ChestInventoryItem[];
  if (data && typeof data === 'object') {
    const raw = data as Record<string, unknown>;
    for (const key of ['items', 'inventory', 'chests'] as const) {
      const value = raw[key];
      if (Array.isArray(value)) return value as ChestInventoryItem[];
    }
  }
  return [];
}

/** POST /v1/player/chests/:id/open — el server elige el premio antes de animar. */
export async function openChestInventoryItem(chestId: string): Promise<ChestOpenResult> {
  const data = await postJson<unknown>(`/v1/player/chests/${chestId}/open`, {});
  return normalizeChestOpenResult(data);
}
