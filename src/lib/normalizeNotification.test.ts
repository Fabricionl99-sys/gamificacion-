import { describe, expect, it } from 'vitest';

import { normalizePlayerNotification } from './normalizeNotification';

describe('normalizePlayerNotification', () => {
  it('maps backend in-app notification fields', () => {
    expect(
      normalizePlayerNotification({
        id: 'n1',
        trigger_event: 'manual',
        title: '¡Tenés un nuevo premio!',
        body: 'Te entregamos un avatar de regalo.',
        icon: '🎁',
        cta_label: 'Ver colección',
        cta_url: 'https://demo.social2game.com/profile',
        image_url: null,
        created_at: '2026-05-18T12:00:00Z',
        opened: false,
      }),
    ).toMatchObject({
      id: 'n1',
      trigger_event: 'manual',
      opened: false,
      body: 'Te entregamos un avatar de regalo.',
    });
  });

  it('supports legacy mock fields', () => {
    expect(
      normalizePlayerNotification({
        id: 'legacy',
        title: 'Premio',
        detail: 'Detalle',
        createdAt: '2026-05-18T12:00:00Z',
        read: true,
      }),
    ).toMatchObject({
      body: 'Detalle',
      opened: true,
    });
  });

  it('treats seen_at as opened', () => {
    expect(
      normalizePlayerNotification({
        id: 'seen',
        title: 'Vista',
        body: 'Body',
        seen_at: '2026-05-18T12:00:00Z',
      }).opened,
    ).toBe(true);
  });
});
