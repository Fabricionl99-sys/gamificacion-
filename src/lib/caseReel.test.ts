import { describe, expect, it } from 'vitest';

import {
  buildCaseReelKeyframes,
  buildReelStripItems,
  caseItemStride,
  computeReelTarget,
  REEL_WIN_STRIP_INDEX,
  reelEase,
} from './caseReel';

describe('caseReel', () => {
  it('uses 150px cards + 14px gap stride', () => {
    expect(caseItemStride()).toBe(164);
  });

  it('ease-out curve starts fast and ends slow', () => {
    expect(reelEase(0)).toBe(0);
    expect(reelEase(1)).toBe(1);
    expect(reelEase(0.5)).toBeGreaterThan(0.5);
    expect(reelEase(0.9)).toBeGreaterThan(0.95);
  });

  it('computeReelTarget centers winner under marker', () => {
    const target = computeReelTarget(400, REEL_WIN_STRIP_INDEX);
    expect(target).toBeLessThan(0);
    const marker = 200;
    const winCenter = REEL_WIN_STRIP_INDEX * caseItemStride() + 75;
    expect(Math.abs(marker - (winCenter + target))).toBeLessThan(50);
  });

  it('buildReelStripItems pins winner at win index', () => {
    const pool = ['a', 'b', 'c'];
    const strip = buildReelStripItems(pool, 'WIN', () => 'x', 10, 7);
    expect(strip[7]).toBe('WIN');
    expect(strip.filter((v) => v === 'WIN')).toHaveLength(1);
  });

  it('legacy keyframes still decelerate toward prize', () => {
    const { x, times, durationS } = buildCaseReelKeyframes(2, 5, { minFullLoops: 2 });
    expect(x[0]).toBe(0);
    expect(x[1]).toBeLessThan(0);
    expect(Math.abs(x[1]!)).toBeGreaterThan(5 * 164 * 0.9);
    expect(times[1]).toBeLessThan(times[2]!);
    expect(x[x.length - 1]).toBeLessThan(x[1]!);
    expect(durationS).toBeGreaterThanOrEqual(4);
  });
});
