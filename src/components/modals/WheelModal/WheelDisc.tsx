import { SEGMENT_COUNT } from '../../../lib/wheelSpin';

const SLICE_DEG = 360 / SEGMENT_COUNT;

/** Colores alternados para 8 casillas — círculo perfecto vía aspect-square + conic-gradient */
const WHEEL_CONIC = `conic-gradient(
  from -${SLICE_DEG / 2}deg,
  rgba(10, 247, 132, 0.55) 0deg ${SLICE_DEG}deg,
  rgba(30, 37, 47, 0.95) ${SLICE_DEG}deg ${SLICE_DEG * 2}deg,
  rgba(10, 247, 132, 0.35) ${SLICE_DEG * 2}deg ${SLICE_DEG * 3}deg,
  rgba(30, 37, 47, 0.95) ${SLICE_DEG * 3}deg ${SLICE_DEG * 4}deg,
  rgba(255, 176, 32, 0.45) ${SLICE_DEG * 4}deg ${SLICE_DEG * 5}deg,
  rgba(30, 37, 47, 0.95) ${SLICE_DEG * 5}deg ${SLICE_DEG * 6}deg,
  rgba(77, 159, 255, 0.4) ${SLICE_DEG * 6}deg ${SLICE_DEG * 7}deg,
  rgba(30, 37, 47, 0.95) ${SLICE_DEG * 7}deg 360deg
)`;

interface WheelDiscProps {
  size?: 'md' | 'lg';
  centerLabel?: string;
  className?: string;
}

const sizeMap = {
  md: 'size-48',
  lg: 'size-56',
} as const;

const hubMap = {
  md: 'size-20 text-xs',
  lg: 'size-24 text-sm',
} as const;

export function WheelDisc({ size = 'lg', centerLabel = 'rueda', className = '' }: WheelDiscProps) {
  return (
    <div
      className={`relative shrink-0 aspect-square rounded-full border border-border-accent shadow-card ${sizeMap[size]} ${className}`}
      style={{ background: WHEEL_CONIC }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `repeating-conic-gradient(
            from -${SLICE_DEG / 2}deg,
            transparent 0deg ${SLICE_DEG - 1.5}deg,
            rgba(0, 0, 0, 0.35) ${SLICE_DEG - 1.5}deg ${SLICE_DEG}deg
          )`,
        }}
      />
      <div
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border-default bg-bg-primary font-semibold text-text-secondary ${hubMap[size]}`}
      >
        {centerLabel}
      </div>
    </div>
  );
}
