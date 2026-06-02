import type { NewsItem } from '../types/social';
import { getJson, postJson } from './fetchJson';

interface BackendNewsRow {
  id?: string;
  code?: string;
  title?: string;
  body?: string;
  image_url?: string | null;
  cta_url?: string | null;
  cta_label?: string | null;
  published_at?: string;
  created_at?: string;
  category?: string;
  expires_at?: string | null;
}

function mapCategory(raw: string | undefined): NewsItem['category'] {
  const value = (raw ?? 'anuncio').toLowerCase();
  if (value === 'promo' || value === 'promocion') return 'promo';
  if (value === 'evento' || value === 'event') return 'evento';
  if (value === 'sistema' || value === 'system') return 'sistema';
  return 'anuncio';
}

function adaptNewsItem(raw: BackendNewsRow): NewsItem {
  return {
    id: String(raw.id ?? raw.code ?? ''),
    code: String(raw.code ?? raw.id ?? ''),
    category: mapCategory(raw.category),
    title: String(raw.title ?? 'Novedad'),
    body: String(raw.body ?? ''),
    imageUrl: raw.image_url ?? undefined,
    ctaUrl: raw.cta_url ?? undefined,
    ctaLabel: raw.cta_label ?? undefined,
    createdAt: String(raw.published_at ?? raw.created_at ?? new Date().toISOString()),
    expiresAt: raw.expires_at ?? undefined,
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const rows = await getJson<BackendNewsRow[]>('/v1/player/news');
  return rows.map(adaptNewsItem);
}

/** Fire-and-forget — idempotente en backend. */
export function trackNewsView(code: string): void {
  void postJson(`/v1/player/news/${encodeURIComponent(code)}/view`).catch(() => undefined);
}

/** Fire-and-forget al hacer click en CTA o card. */
export function trackNewsClick(code: string): void {
  void postJson(`/v1/player/news/${encodeURIComponent(code)}/click`).catch(() => undefined);
}
