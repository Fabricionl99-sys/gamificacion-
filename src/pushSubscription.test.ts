import { describe, expect, it } from 'vitest';

import {
  pushSubscriptionTokenString,
  resolveVapidPublicKey,
  urlBase64ToUint8Array,
} from './pushSubscription';

describe('pushSubscription', () => {
  it('converts url-safe base64 VAPID key to Uint8Array', () => {
    const bytes = urlBase64ToUint8Array('AQID');
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
  });

  it('serializes push subscription as JSON string token', () => {
    const sub = {
      toJSON: () => ({
        endpoint: 'https://fcm.example/push',
        keys: { p256dh: 'abc', auth: 'def' },
      }),
    } as unknown as PushSubscription;
    const token = pushSubscriptionTokenString(sub);
    expect(typeof token).toBe('string');
    expect(JSON.parse(token).endpoint).toBe('https://fcm.example/push');
  });

  it('resolves VAPID key from branding with env fallback', () => {
    expect(resolveVapidPublicKey('from-branding', 'from-env')).toBe('from-branding');
    expect(resolveVapidPublicKey(null, 'from-env')).toBe('from-env');
    expect(resolveVapidPublicKey('', '  ')).toBeNull();
  });
});
