import { describe, expect, it } from 'vitest';

import { getChestDesign, resolveChestVisualStyle } from './chestDesigns';

describe('chestDesigns', () => {
  it('resolves known visual styles', () => {
    expect(resolveChestVisualStyle('plasma')).toBe('plasma');
    expect(getChestDesign('holo').label).toBe('Holográfico');
  });

  it('falls back to neon for unknown style', () => {
    expect(resolveChestVisualStyle('airdrop')).toBe('neon');
  });
});
