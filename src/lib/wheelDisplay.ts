import type { CSSProperties } from 'react';

export interface WheelSegmentDisplay {
  name: string;
  color: string;
  imageUrl?: string | null;
}

const FALLBACK_COLORS = [
  'rgba(10, 247, 132, 0.55)',
  'rgba(30, 37, 47, 0.95)',
  'rgba(10, 247, 132, 0.35)',
  'rgba(30, 37, 47, 0.95)',
  'rgba(255, 176, 32, 0.45)',
  'rgba(30, 37, 47, 0.95)',
  'rgba(77, 159, 255, 0.4)',
  'rgba(30, 37, 47, 0.95)',
];

/** Pointer at top; first segment centered under pointer (matches wheelSpin). */
export const WHEEL_GRADIENT_FROM_DEG = -90;

export function normalizeWheelSegments(segments: WheelSegmentDisplay[]): WheelSegmentDisplay[] {
  if (segments.length >= 2) return segments;
  return FALLBACK_COLORS.map((color, i) => ({
    name: `Premio ${i + 1}`,
    color,
    imageUrl: null,
  }));
}

export function buildWheelConicGradient(
  segments: WheelSegmentDisplay[],
  fromDeg = WHEEL_GRADIENT_FROM_DEG,
): string {
  const list = normalizeWheelSegments(segments);
  const slice = 360 / list.length;
  const stops = list
    .map((s, i) => `${s.color} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(', ');
  return `conic-gradient(from ${fromDeg}deg, ${stops})`;
}

export function buildWheelDividerOverlay(segmentCount: number, fromDeg = WHEEL_GRADIENT_FROM_DEG): string {
  const slice = 360 / segmentCount;
  return `repeating-conic-gradient(
    from ${fromDeg}deg,
    transparent 0deg ${slice - 1.2}deg,
    rgba(0, 0, 0, 0.32) ${slice - 1.2}deg ${slice}deg
  )`;
}

/**
 * Prize icon along slice bisector (~62% radius), rotated to point outward from center.
 */
export function getSliceIconStyle(
  index: number,
  segmentCount: number,
  iconSizePercent = 13,
): CSSProperties {
  const slice = 360 / segmentCount;
  const angleDeg = WHEEL_GRADIENT_FROM_DEG + index * slice + slice / 2;
  const radiusPercent = 62;
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPercent * Math.cos(rad);
  const y = 50 + radiusPercent * Math.sin(rad);
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: `${iconSizePercent}%`,
    height: `${iconSizePercent}%`,
    transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg)`,
  };
}

export interface WheelVisualConfig {
  backgroundImageUrl?: string | null;
  centerLogoUrl?: string | null;
  segments: WheelSegmentDisplay[];
}

export function wheelSegmentsFromPrizes(
  prizes: Array<{
    name: string;
    color_theme: string;
    image_url?: string | null;
    display_order?: number;
  }>,
): WheelSegmentDisplay[] {
  return [...prizes]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((p) => ({
      name: p.name,
      color: p.color_theme,
      imageUrl: p.image_url ?? null,
    }));
}
