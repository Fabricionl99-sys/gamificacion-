import { getJson } from './fetchJson';

export type PlayerAvatar = {
  id: string;
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  image_urls?: Record<string, string>;
};

export async function getAvatars(): Promise<PlayerAvatar[]> {
  const data = await getJson<{ items?: PlayerAvatar[] } | PlayerAvatar[]>('/v1/player/avatars');
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}
