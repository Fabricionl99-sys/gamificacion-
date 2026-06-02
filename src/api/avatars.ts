import { getJson } from './fetchJson';
import { getAvatarImageUrl } from '../utils/avatarImageUrl';

export type PlayerAvatar = {
  id: string;
  code: string;
  name: string;
  description?: string;
  image_url?: string | null;
  image_urls?: { original?: string | null } | Record<string, string | null | undefined> | null;
  is_active?: boolean;
};

function normalizePlayerAvatar(raw: Record<string, unknown>): PlayerAvatar {
  const imageUrl = getAvatarImageUrl(raw);
  return {
    id: String(raw.id ?? raw.avatar_id ?? ''),
    code: String(raw.code ?? raw.avatar_code ?? ''),
    name: String(raw.name ?? raw.avatar_name ?? raw.code ?? 'Avatar'),
    description: typeof raw.description === 'string' ? raw.description : undefined,
    image_url: imageUrl,
    image_urls:
      raw.image_urls && typeof raw.image_urls === 'object'
        ? (raw.image_urls as PlayerAvatar['image_urls'])
        : imageUrl
          ? { original: imageUrl }
          : null,
    is_active: raw.is_active === true || raw.is_active_equipped === true,
  };
}

function unwrapAvatarRows(data: unknown): PlayerAvatar[] {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { items?: unknown[] }).items)
      ? (data as { items: unknown[] }).items
      : [];
  return rows
    .map((row) => normalizePlayerAvatar(row as Record<string, unknown>))
    .filter((row) => row.id.length > 0);
}

/** Owned avatars — GET /v1/player/avatars/inventory (td-96 image_urls). */
export async function getAvatarInventory(): Promise<PlayerAvatar[]> {
  const data = await getJson<unknown>('/v1/player/avatars/inventory');
  return unwrapAvatarRows(data);
}

/** Catalog / legacy list — GET /v1/player/avatars. */
export async function getAvatars(): Promise<PlayerAvatar[]> {
  const data = await getJson<unknown>('/v1/player/avatars');
  return unwrapAvatarRows(data);
}

export { getAvatarImageUrl };
