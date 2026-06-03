import { describe, expect, it } from 'vitest';

import { normalizeDemoSession } from './normalizeDemoSession';

describe('normalizeDemoSession', () => {
  it('reads jwt + external_player_id from reset payload', () => {
    expect(
      normalizeDemoSession({
        jwt: 'eyJ.test',
        external_player_id: 'ext_demo_42',
      }),
    ).toEqual({
      access_token: 'eyJ.test',
      player_id: 'ext_demo_42',
      external_player_id: 'ext_demo_42',
      tenant_id: null,
      currency_code: null,
    });
  });

  it('reads currency_code from session payload', () => {
    expect(
      normalizeDemoSession({
        access_token: 'tok_1',
        player_id: 'pl_1',
        currency_code: 'rd',
      }),
    ).toEqual({
      access_token: 'tok_1',
      player_id: 'pl_1',
      external_player_id: 'pl_1',
      tenant_id: null,
      currency_code: 'RD',
    });
  });

  it('reads access_token + player_id from legacy session payload', () => {
    expect(
      normalizeDemoSession({
        access_token: 'tok_1',
        player_id: 'pl_1',
        tenant_id: 'tenant-uuid',
      }),
    ).toEqual({
      access_token: 'tok_1',
      player_id: 'pl_1',
      external_player_id: 'pl_1',
      tenant_id: 'tenant-uuid',
      currency_code: null,
    });
  });
});
