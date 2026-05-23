import { apiClient } from './client';
import type { WalletCurrency } from '../types/currency';

interface BackendCurrency {
  id: string;
  currency_id?: string;
  code?: string;
  name?: string;
  currency_name?: string;
  icon_url?: string | null;
  image_url?: string | null;
  balance?: number;
}

function adaptCurrency(raw: BackendCurrency): WalletCurrency {
  const code = raw.code;
  return {
    id: String(raw.id ?? raw.currency_id ?? code ?? ''),
    code,
    name: String(raw.name ?? raw.currency_name ?? code ?? 'Moneda'),
    balance: typeof raw.balance === 'number' ? raw.balance : 0,
    imageUrl: raw.icon_url ?? raw.image_url ?? undefined,
  };
}

function unwrapList(payload: unknown): BackendCurrency[] {
  if (Array.isArray(payload)) return payload as BackendCurrency[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: BackendCurrency[] }).data;
  }
  return [];
}

export async function getPlayerCurrencies(): Promise<WalletCurrency[]> {
  const paths = ['/v1/player/me/currencies', '/v1/player/me/currency', '/v1/player/currencies'];
  for (const path of paths) {
    try {
      const { data } = await apiClient.get<unknown>(path);
      const list = unwrapList(data);
      if (list.length > 0) return list.map(adaptCurrency);
    } catch {
      // try next path
    }
  }
  return [];
}

export function findCurrency(currencies: WalletCurrency[], id: string | undefined | null): WalletCurrency | undefined {
  if (!id) return undefined;
  const needle = id.toLowerCase();
  return currencies.find(
    (c) => c.id.toLowerCase() === needle || (c.code ? c.code.toLowerCase() === needle : false),
  );
}

export function resolveRaffleCurrency(
  currencies: WalletCurrency[],
  raffle: { entryCostCurrencyId: string; entryCostCurrencyCode?: string | null; entryCostCurrencyName?: string | null },
): WalletCurrency | undefined {
  return (
    findCurrency(currencies, raffle.entryCostCurrencyId) ??
    findCurrency(currencies, raffle.entryCostCurrencyCode ?? undefined) ??
    (raffle.entryCostCurrencyName
      ? currencies.find((c) => c.name.toLowerCase() === raffle.entryCostCurrencyName!.toLowerCase())
      : undefined)
  );
}

export function formatCurrencyCost(amount: number, currency: WalletCurrency | undefined): string {
  const unit = currency?.name ?? currency?.code ?? 'gemas';
  return `${amount} ${unit}`;
}
