import { describe, expect, it } from 'vitest';

import { computeWheelLandDelta, segmentTargetAngle } from './wheelSpin';

describe('wheelSpin', () => {
  it('lands on target segment angle', () => {
    const delta = computeWheelLandDelta(0, 0);
    const final = delta % 360;
    expect(final).toBeCloseTo(segmentTargetAngle(0), 5);
  });

  it('spin delta is always forward (positive)', () => {
    const delta = computeWheelLandDelta(3, 120);
    expect(delta).toBeGreaterThan(0);
  });
});
