import { describe, expect, it } from 'vitest';

import { buildWheelConicGradient, getSliceIconStyle, normalizeWheelSegments } from './wheelDisplay';

describe('wheelDisplay', () => {
  it('normalizes to at least 2 segments', () => {
    expect(normalizeWheelSegments([]).length).toBeGreaterThanOrEqual(2);
  });

  it('builds conic gradient for N segments', () => {
    const g = buildWheelConicGradient([
      { name: 'A', color: '#f00' },
      { name: 'B', color: '#00f' },
    ]);
    expect(g).toContain('conic-gradient');
    expect(g).toContain('#f00');
    expect(g).toContain('#00f');
  });

  it('positions slice icons off center', () => {
    const style = getSliceIconStyle(0, 8);
    expect(style.left).not.toBe('50%');
    expect(style.top).not.toBe('50%');
  });
});
