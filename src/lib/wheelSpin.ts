export const WHEEL_SPIN_DURATION_S = 6.5;
export const WHEEL_SPIN_POST_STOP_MS = 450;
export const WHEEL_MIN_FULL_ROTATIONS = 7;
export const SEGMENT_COUNT = 8;

/** Un solo easing ease-out: velocidad solo baja, sin tramos que aceleren al final. */
export const WHEEL_SPIN_EASE: [number, number, number, number] = [0.12, 0.88, 0.22, 1];

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
