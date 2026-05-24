import { describe, expect, it } from 'vitest';

import { resolveVapidPublicKey, urlBase64ToUint8Array } from './pushSubscription';

describe('pushSubscription', () => {
  it('converts url-safe base64 VAPID key to Uint8Array', () => {
    const bytes = urlBase64ToUint8Array('AQID');
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
  });

  it('resolves VAPID key from branding with env fallback', () => {
    expect(resolveVapidPublicKey('from-branding', 'from-env')).toBe('from-branding');
    expect(resolveVapidPublicKey(null, 'from-env')).toBe('from-env');
    expect(resolveVapidPublicKey('', '  ')).toBeNull();
  });
});
