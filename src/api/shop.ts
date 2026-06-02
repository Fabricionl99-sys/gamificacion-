import type { ShopItem } from '../types/reward';
import { getJson, postJson } from './fetchJson';

interface BackendShopProduct {
  id: string;
  code?: string;
  name: string;
  description?: string;
  image_url?: string | null;
  cost_in_coins?: number | string;
  cost_amount?: number | string;
  cost_coins?: number;
  currency_code?: string | null;
  category?: string;
  product_type?: string;
  stock?: number | null;
  low_stock_threshold?: number;
  vip_only?: boolean;
  vip_tier_required?: string | null;
  min_level?: number | null;
  ends_at?: string | null;
  featured?: boolean;
  disabled_reason?: string | null;
  reward_type?: string;
}

function mapCategory(raw: BackendShopProduct): ShopItem['category'] {
  const value = (raw.category ?? raw.product_type ?? '').toLowerCase();
  if (value.includes('physical') || value.includes('fisico')) return 'physical';
  if (value.includes('bonus') || value.includes('operator')) return 'operatorBonus';
  return 'gamification';
}

function mapIcon(raw: BackendShopProduct): ShopItem['icon'] {
  const value = (raw.product_type ?? raw.category ?? raw.reward_type ?? '').toLowerCase();
  if (value.includes('box') || value.includes('chest') || value.includes('cofre')) return 'box';
  if (value.includes('shirt') || value.includes('physical')) return 'shirt';
  if (value.includes('boost') || value.includes('xp')) return 'zap';
  return 'sparkles';
}

function mapVip(raw: BackendShopProduct): ShopItem['vipRequired'] {
  if (raw.vip_only) return 'silver';
  const tier = raw.vip_tier_required?.toLowerCase();
  if (tier === 'bronze' || tier === 'silver' || tier === 'gold' || tier === 'diamond') return tier;
  return null;
}

function adaptProduct(raw: BackendShopProduct): ShopItem {
  return {
    id: raw.id,
    category: mapCategory(raw),
    name: raw.name,
    description: raw.description ?? '',
    cost: Number(raw.cost_in_coins ?? raw.cost_coins ?? raw.cost_amount) || 0,
    icon: mapIcon(raw),
    imageUrl: raw.image_url ?? undefined,
    featured: Boolean(raw.featured),
    stock: raw.stock ?? null,
    lowStockThreshold: raw.low_stock_threshold ?? 5,
    vipRequired: mapVip(raw),
    endsAt: raw.ends_at ?? null,
    disabledReason: raw.disabled_reason ?? undefined,
    currencyCode: raw.currency_code ?? undefined,
    code: raw.code,
    minLevel: raw.min_level ?? undefined,
  };
}

export async function getShopItems(): Promise<ShopItem[]> {
  const rows = await getJson<BackendShopProduct[]>('/v1/player/shop/products');
  return rows.map(adaptProduct);
}

export interface PurchaseShopProductResult {
  ok?: boolean;
  purchase_id?: string;
  new_balance?: number;
}

export async function purchaseShopProduct(
  productId: string,
  purchaseRequestId: string,
): Promise<PurchaseShopProductResult> {
  return postJson<PurchaseShopProductResult>(`/v1/player/shop/products/${productId}/purchase`, {
    purchase_request_id: purchaseRequestId,
  });
}
