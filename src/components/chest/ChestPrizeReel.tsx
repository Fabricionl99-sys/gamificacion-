import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  buildReelStripItems,
  CASE_ITEM_GAP_PX,
  CASE_ITEM_WIDTH_PX,
  computeReelPreviewOffset,
  computeReelTarget,
  REEL_FRAME_HEIGHT_PX,
  REEL_ITEM_HEIGHT_PX,
  REEL_ITEM_TOP_MARGIN_PX,
  REEL_SPIN_DURATION_MS,
  REEL_WIN_STRIP_INDEX,
  reelEase,
} from '../../lib/caseReel';
import type { ChestPrizeDisplay } from '../../lib/chestPrizes';

interface ChestPrizeReelProps {
  prizes: ChestPrizeDisplay[];
  winIndex: number;
  spinning: boolean;
  /** Mantiene la tira en la posición final tras el giro */
  frozen?: boolean;
  onSpinComplete?: () => void;
}

const RARITY = {
  common: { label: 'Común', color: '#7e90b0', bg: 'rgba(126,144,176,0.18)' },
  rare: { label: 'Raro', color: '#ffce4a', bg: 'rgba(255,206,74,0.18)' },
} as const;

function pickRandomPrize(pool: ChestPrizeDisplay[]): ChestPrizeDisplay {
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]!;
}

function PrizeCard({
  prize,
  winner,
}: {
  prize: ChestPrizeDisplay;
  winner?: boolean;
}) {
  const rarity = prize.isRare ? RARITY.rare : RARITY.common;

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-300 ${
        winner ? 'scale-[1.06] shadow-[0_0_30px_var(--rar)]' : ''
      }`}
      style={{
        width: CASE_ITEM_WIDTH_PX,
        height: REEL_ITEM_HEIGHT_PX,
        marginTop: REEL_ITEM_TOP_MARGIN_PX,
        borderColor: rarity.color,
        background: 'linear-gradient(180deg, rgba(20,28,46,0.9), rgba(10,15,28,0.95))',
        ['--rar' as string]: rarity.color,
        ['--rarbg' as string]: rarity.bg,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: `linear-gradient(180deg, transparent 55%, ${rarity.bg})` }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: rarity.color, boxShadow: `0 0 14px ${rarity.color}` }}
      />

      <div className="relative z-[1] grid h-[50px] w-[50px] place-items-center" style={{ color: rarity.color, filter: `drop-shadow(0 0 8px ${rarity.color})` }}>
        {prize.imageUrl ? (
          <img src={prize.imageUrl} alt="" className="h-full w-full object-contain" draggable={false} />
        ) : (
          <span className="text-3xl leading-none">{prize.emoji ?? '🎁'}</span>
        )}
      </div>

      <p className="relative z-[1] line-clamp-2 px-2 text-center text-[13px] font-semibold leading-tight text-[#eaf1ff]">
        {prize.label}
      </p>
      <p
        className="relative z-[1] text-[9px] font-bold uppercase tracking-[0.2em]"
        style={{ color: rarity.color }}
      >
        {rarity.label}
      </p>
    </div>
  );
}

function ReelMarker() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[4] w-[2px] -translate-x-1/2"
      style={{ background: '#ffce4a', boxShadow: '0 0 16px #ffce4a' }}
      aria-hidden="true"
    >
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 border-x-[9px] border-x-transparent border-t-[12px]"
        style={{ borderTopColor: '#ffce4a' }}
      />
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 border-x-[9px] border-x-transparent border-b-[12px]"
        style={{ borderBottomColor: '#ffce4a' }}
      />
    </div>
  );
}

export function ChestPrizeReel({ prizes, winIndex, spinning, frozen = false, onSpinComplete }: ChestPrizeReelProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [winnerHighlight, setWinnerHighlight] = useState(false);

  const winner = prizes[winIndex] ?? prizes[0]!;

  const spinStrip = useMemo(() => {
    if (!prizes.length) return [];
    return buildReelStripItems(prizes, winner, () => pickRandomPrize(prizes));
  }, [prizes, winner, spinning]);

  const previewItems = useMemo(() => {
    if (!prizes.length) return [];
    return [...prizes, ...prizes, ...prizes];
  }, [prizes]);

  const showSpinStrip = spinning || frozen;

  useLayoutEffect(() => {
    if (showSpinStrip || !frameRef.current || !stripRef.current) return;
    const frameWidth = frameRef.current.clientWidth;
    const offset = computeReelPreviewOffset(frameWidth, prizes.length);
    stripRef.current.style.transform = `translateX(${offset}px)`;
    setWinnerHighlight(false);
  }, [previewItems, prizes.length, showSpinStrip]);

  useEffect(() => {
    if (!spinning || frozen || !frameRef.current || !stripRef.current || !spinStrip.length) return undefined;

    const strip = stripRef.current;
    const frame = frameRef.current;
    setWinnerHighlight(false);
    strip.style.transform = 'translateX(0)';

    const target = computeReelTarget(frame.clientWidth);
    const started = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / REEL_SPIN_DURATION_MS);
      const pos = target * reelEase(t);
      strip.style.transform = `translateX(${pos}px)`;
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setWinnerHighlight(true);
        onSpinComplete?.();
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [spinning, frozen, spinStrip, onSpinComplete]);

  useEffect(() => {
    if (frozen) setWinnerHighlight(true);
  }, [frozen]);

  const items = showSpinStrip ? spinStrip : previewItems;

  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden rounded-[14px] border border-[rgba(120,160,220,0.18)]"
      style={{
        height: REEL_FRAME_HEIGHT_PX,
        background: 'linear-gradient(180deg, rgba(10,16,30,0.9), rgba(6,10,20,0.95))',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), 0 0 50px rgba(35,240,255,0.08)',
      }}
    >
      <ReelMarker />

      <div
        ref={stripRef}
        className="absolute bottom-0 left-0 top-0 flex will-change-transform"
        style={{ gap: CASE_ITEM_GAP_PX }}
      >
        {items.map((prize, index) => (
          <PrizeCard
            key={`${prize.id}-${index}-${spinning ? 'spin' : 'idle'}`}
            prize={prize}
            winner={winnerHighlight && showSpinStrip && index === REEL_WIN_STRIP_INDEX}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[3] w-[min(120px,18%)]"
        style={{ background: 'linear-gradient(90deg, var(--bg-primary, #070c18), transparent)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-[3] w-[min(120px,18%)]"
        style={{ background: 'linear-gradient(270deg, var(--bg-primary, #070c18), transparent)' }}
      />
    </div>
  );
}
