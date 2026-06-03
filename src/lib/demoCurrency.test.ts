import { describe, expect, it, beforeEach } from 'vitest';

import { clearDemoSession, persistDemoCurrencyCode } from './demoSessionStorage';
import { getCurrencyCodeFromUrl, resolveDemoMintCurrencyCode } from './demoCurrency';

describe('demoCurrency', () => {
  beforeEach(() => {
    clearDemoSession();
    window.history.replaceState({}, '', '/');
  });

  it('reads currency from URL param', () => {
    window.history.replaceState({}, '', '/?currency=usd');
    expect(getCurrencyCodeFromUrl()).toBe('USD');
  });

  it('prefers URL currency over stored value for mint', () => {
    persistDemoCurrencyCode('RD');
    window.history.replaceState({}, '', '/?currency=CLP');
    expect(resolveDemoMintCurrencyCode()).toBe('CLP');
  });

  it('falls back to stored currency when URL has no param', () => {
    persistDemoCurrencyCode('RD');
    expect(resolveDemoMintCurrencyCode()).toBe('RD');
  });
});
