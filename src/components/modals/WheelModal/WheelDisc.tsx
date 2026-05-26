import {
  buildWheelConicGradient,
  buildWheelDividerOverlay,
  getSliceIconStyle,
  normalizeWheelSegments,
  type WheelSegmentDisplay,
} from '../../../lib/wheelDisplay';

export interface WheelDiscProps {
  segments: WheelSegmentDisplay[];
  backgroundImageUrl?: string | null;
  centerLogoUrl?: string | null;
  size?: 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  md: 'size-48',
  lg: 'size-56 sm:size-64',
} as const;

const hubMap = {
  md: 'h-[38%] w-[38%]',
  lg: 'h-[36%] w-[36%]',
} as const;

export function WheelDisc({
  segments,
  backgroundImageUrl,
  centerLogoUrl,
  size = 'lg',
  className = '',
}: WheelDiscProps) {
  const normalized = normalizeWheelSegments(segments);
  const count = normalized.length;
  const gradient = buildWheelConicGradient(normalized);
  const dividers = buildWheelDividerOverlay(count);

  return (
    <div
      className={`relative shrink-0 aspect-square rounded-full border border-border-accent shadow-card overflow-hidden ${sizeMap[size]} ${className}`}
    >
      {backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 rounded-full ${backgroundImageUrl ? 'opacity-80 mix-blend-multiply' : ''}`}
        style={{ background: gradient }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: dividers }}
      />

      {normalized.map((segment, index) =>
        segment.imageUrl ? (
          <img
            key={`${segment.name}-${index}`}
            src={segment.imageUrl}
            alt=""
            draggable={false}
            className="pointer-events-none object-contain drop-shadow-sm"
            style={getSliceIconStyle(index, count, size === 'md' ? 12 : 13)}
          />
        ) : null,
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className={`grid place-items-center overflow-hidden rounded-full border-2 border-border-default bg-bg-primary shadow-inner ${hubMap[size]}`}
        >
          {centerLogoUrl ? (
            <img
              src={centerLogoUrl}
              alt=""
              className="h-[88%] w-[88%] object-contain"
              draggable={false}
            />
          ) : (
            <span className="px-1 text-center text-[10px] font-semibold leading-tight text-text-tertiary sm:text-xs">
              logo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
