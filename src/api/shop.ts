import type { ShopItem } from '../types/reward';
import { getJson } from './fetchJson';

interface BackendShopProduct {
  id: string;
  name: string;
  description?: string;
  image_url?: string | null;
  cost_amount?: number | string;
  cost_coins?: number;
  cost_currency_id?: string | null;
  cost_currency_code?: string | null;
  category?: string;
  product_type?: string;
  stock?: number | null;
  low_stock_threshold?: number;
  vip_tier_required?: string | null;
  ends_at?: string | null;
  featured?: boolean;
  disabled_reason?: string | null;
}

function mapCategory(raw: BackendShopProduct): ShopItem['category'] {
  const value = (raw.category ?? raw.product_type ?? '').toLowerCase();
  if (value.includes('physical') || value.includes('fisico')) return 'physical';
  if (value.includes('bonus') || value.includes('operator')) return 'operatorBonus';
  return 'gamification';
}

function mapIcon(raw: BackendShopProduct): ShopItem['icon'] {
  const value = (raw.product_type ?? raw.category ?? '').toLowerCase();
  if (value.includes('box') || value.includes('chest') || value.includes('cofre')) return 'box';
  if (value.includes('shirt') || value.includes('physical')) return 'shirt';
  if (value.includes('boost') || value.includes('xp')) return 'zap';
  return 'sparkles';
}

function adaptProduct(raw: BackendShopProduct): ShopItem {
  return {
    id: raw.id,
    category: mapCategory(raw),
    name: raw.name,
    description: raw.description ?? '',
    cost: Number(raw.cost_coins ?? raw.cost_amount) || 0,
    icon: mapIcon(raw),
    imageUrl: raw.image_url ?? undefined,
    featured: Boolean(raw.featured),
    stock: raw.stock ?? null,
    lowStockThreshold: raw.low_stock_threshold ?? 5,
    vipRequired: (raw.vip_tier_required as ShopItem['vipRequired']) ?? null,
    endsAt: raw.ends_at ?? null,
    disabledReason: raw.disabled_reason ?? undefined,
  };
}

export async function getShopItems(): Promise<ShopItem[]> {
  const rows = await getJson<BackendShopProduct[]>('/v1/player/shop/products');
  return rows.map(adaptProduct);
}
