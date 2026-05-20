export const WHEEL_SPIN_DURATION_S = 6.5;
export const WHEEL_SPIN_POST_STOP_MS = 450;
export const WHEEL_MIN_FULL_ROTATIONS = 7;
export const SEGMENT_COUNT = 8;

export function segmentTargetAngle(targetIndex: number, segmentCount = SEGMENT_COUNT): number {
  const slice = 360 / segmentCount;
  return (360 - targetIndex * slice - slice / 2 + 360) % 360;
}

export function computeWheelLandDelta(
  targetIndex: number,
  startRotation = 0,
  segmentCount = SEGMENT_COUNT,
  minFullRotations = WHEEL_MIN_FULL_ROTATIONS,
): number {
  const targetNorm = segmentTargetAngle(targetIndex, segmentCount);
  const startNorm = ((startRotation % 360) + 360) % 360;
  const align = (targetNorm - startNorm + 360) % 360;
  return minFullRotations * 360 + align;
}

export function buildSpinRotationKeyframes(startRotation: number, landDelta: number): number[] {
  const finalRot = startRotation + landDelta;
  return [
    startRotation,
    startRotation + landDelta * 0.05,
    startRotation + landDelta * 0.38,
    startRotation + landDelta * 0.9,
    finalRot + 3,
    finalRot,
  ];
}
