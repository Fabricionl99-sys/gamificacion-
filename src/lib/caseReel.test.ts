import { describe, expect, it } from 'vitest';

import { buildCaseReelKeyframes } from './caseReel';

describe('caseReel', () => {
  it('passes through all items before decelerating', () => {
    const { x, times, durationS } = buildCaseReelKeyframes(2, 5, { minFullLoops: 2 });
    expect(x[0]).toBe(0);
    expect(x[1]).toBeLessThan(0);
    expect(Math.abs(x[1]!)).toBeGreaterThan(5 * 132 * 0.9);
    expect(times[1]).toBeLessThan(times[2]!);
    expect(x[x.length - 1]).toBeLessThan(x[1]!);
    expect(durationS).toBeGreaterThanOrEqual(4);
  });
});
