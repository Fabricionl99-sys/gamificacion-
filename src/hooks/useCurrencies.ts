import { useMemo } from 'react';

import { findCurrency, getPlayerCurrencies, resolveRaffleCurrency } from '../api/currencies';
import type { WalletCurrency } from '../types/currency';
import { useAsyncData } from './useAsyncData';
import { usePlayer } from './usePlayer';

function mergeCurrencies(remote: WalletCurrency[], fromPlayer: WalletCurrency[]): WalletCurrency[] {
  const byKey = new Map<string, WalletCurrency>();
  const key = (c: WalletCurrency) => `${c.id}::${c.code ?? ''}`;
  for (const c of remote) byKey.set(key(c), c);
  for (const c of fromPlayer) {
    const existing = byKey.get(key(c));
    byKey.set(key(c), existing ? { ...existing, balance: c.balance } : c);
  }
  return [...byKey.values()];
}

export function useCurrencies() {
  const { player } = usePlayer();
  const remote = useAsyncData(getPlayerCurrencies, [] as WalletCurrency[], []);

  const currencies = useMemo(() => {
    const fromPlayer = player.wallet ?? [];
    if (fromPlayer.length > 0) return mergeCurrencies(remote.data ?? [], fromPlayer);
    return remote.data ?? [];
  }, [player.wallet, remote.data]);

  return {
    currencies,
    isLoading: remote.isLoading,
    error: remote.error,
  };
}

export function useCurrency(currencyId: string | undefined | null) {
  const { currencies, isLoading, error } = useCurrencies();
  const currency = useMemo(() => findCurrency(currencies, currencyId), [currencies, currencyId]);
  return { currency, isLoading, error };
}

export function useRaffleCurrency(raffle: {
  entryCostCurrencyId: string;
  entryCostCurrencyCode?: string | null;
  entryCostCurrencyName?: string | null;
} | null | undefined) {
  const { currencies, isLoading, error } = useCurrencies();
  const currency = useMemo(
    () => (raffle ? resolveRaffleCurrency(currencies, raffle) : undefined),
    [currencies, raffle],
  );
  return { currency, isLoading, error };
}
