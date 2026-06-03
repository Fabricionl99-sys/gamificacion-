import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { buildCaseReelKeyframes, CASE_ITEM_WIDTH_PX } from '../../lib/caseReel';
import type { ChestPrizeDisplay } from '../../lib/chestPrizes';

interface ChestPrizeReelProps {
  prizes: ChestPrizeDisplay[];
  winIndex: number;
  spinning: boolean;
  onSpinComplete?: () => void;
}

export function ChestPrizeReel({ prizes, winIndex, spinning, onSpinComplete }: ChestPrizeReelProps) {
  const reduceMotion = useReducedMotion();
  const baseCount = prizes.length;

  const reel = useMemo(
    () => [...prizes, ...prizes, ...prizes, ...prizes, ...prizes],
    [prizes],
  );

  const keyframes = useMemo(
    () => buildCaseReelKeyframes(winIndex, baseCount, { minFullLoops: 3 }),
    [winIndex, baseCount],
  );

  if (reduceMotion) {
    const won = prizes[winIndex];
    return (
      <div className="rounded-xl border border-accent/30 bg-bg-secondary p-4 text-center">
        <p className="text-lg font-semibold text-accent">{won?.label ?? 'Premio'}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-[radial-gradient(circle_at_top,rgba(10,247,132,0.1),rgba(10,14,19,0.96))] py-5 shadow-glow">
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-[3px] -translate-x-1/2 bg-accent shadow-[0_0_12px_var(--accent)]" />
      <motion.div
        className="flex gap-3 px-6 will-change-transform"
        initial={{ x: 0 }}
        animate={spinning ? { x: keyframes.x } : { x: 0 }}
        transition={
          spinning
            ? {
                duration: keyframes.durationS,
                times: keyframes.times,
                ease: ['easeIn', 'linear', [0.12, 0.75, 0.15, 1], [0.34, 1.2, 0.64, 1], [0.22, 1, 0.36, 1]],
              }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (spinning) onSpinComplete?.();
        }}
      >
        {reel.map((prize, index) => (
          <div
            key={`${prize.id}-${index}`}
            className={`shrink-0 rounded-xl border bg-gradient-to-br p-3 shadow-card ${
              prize.isRare
                ? 'border-warning/50 from-warning/15 to-bg-tertiary'
                : 'border-border-accent/40 from-bg-tertiary to-bg-secondary'
            }`}
            style={{ width: CASE_ITEM_WIDTH_PX, minWidth: CASE_ITEM_WIDTH_PX }}
          >
            {prize.imageUrl ? (
              <img src={prize.imageUrl} alt="" className="mx-auto h-10 w-10 object-contain" draggable={false} />
            ) : (
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-lg">
                {prize.emoji ?? '🎁'}
              </div>
            )}
            <p className="mt-2 truncate text-center text-[11px] font-semibold text-text-primary">{prize.label}</p>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg-primary to-transparent" />
    </div>
  );
}
