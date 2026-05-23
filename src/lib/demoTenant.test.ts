import { describe, expect, it } from 'vitest';

import { getTenantIdFromUrl, isDefaultTenant } from './demoTenant';

describe('demoTenant', () => {
  it('reads tenant from search params', () => {
    window.history.replaceState({}, '', '/?tenant=op_latambet');
    expect(getTenantIdFromUrl()).toBe('op_latambet');
  });

  it('defaults to social2game', () => {
    window.history.replaceState({}, '', '/');
    expect(getTenantIdFromUrl()).toBe('social2game');
  });

  it('detects default tenants', () => {
    expect(isDefaultTenant('social2game')).toBe(true);
    expect(isDefaultTenant('op_latambet')).toBe(false);
  });
});
