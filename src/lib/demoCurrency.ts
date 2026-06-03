import { getStoredDemoCurrencyCode } from './demoSessionStorage';

/** `?currency=USD` from demo URL — undefined if absent or empty. */
export function getCurrencyCodeFromUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = new URLSearchParams(window.location.search).get('currency')?.trim();
  return raw ? raw.toUpperCase() : undefined;
}

/** Currency to send on demo mint: URL param wins, else persisted session currency. */
export function resolveDemoMintCurrencyCode(): string | undefined {
  return getCurrencyCodeFromUrl() ?? getStoredDemoCurrencyCode() ?? undefined;
}
