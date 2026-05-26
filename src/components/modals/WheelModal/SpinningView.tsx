import { useEffect, useMemo, useState } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';

import {
  WHEEL_SPIN_DURATION_S,
  WHEEL_SPIN_EASE,
  WHEEL_SPIN_POST_STOP_MS,
  computeWheelLandDelta,
} from '../../../lib/wheelSpin';
import type { WheelSegmentDisplay, WheelVisualConfig } from '../../../lib/wheelDisplay';
import { WheelDisc } from './WheelDisc';

function wait(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
}

interface SpinningViewProps {
  config: WheelVisualConfig;
  prizeIndex: number;
  onComplete: (won: WheelSegmentDisplay) => void;
}

export function SpinningView({ config, prizeIndex, onComplete }: SpinningViewProps) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const [done, setDone] = useState(false);
  const segmentCount = config.segments.length;
  const won = useMemo(
    () => config.segments[prizeIndex] ?? config.segments[0]!,
    [config.segments, prizeIndex],
  );

  useEffect(() => {
    if (reduceMotion) {
      void wait(400).then(() => onComplete(won));
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      const landDelta = computeWheelLandDelta(prizeIndex, rotation, segmentCount);
      const finalRot = rotation + landDelta;

      await controls.start({
        rotate: finalRot,
        transition: {
          duration: WHEEL_SPIN_DURATION_S,
          ease: WHEEL_SPIN_EASE,
        },
      });

      if (cancelled) return;

      setRotation(finalRot);
      setDone(true);
      await wait(WHEEL_SPIN_POST_STOP_MS);
      if (!cancelled) onComplete(won);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [controls, onComplete, prizeIndex, reduceMotion, rotation, segmentCount, won]);

  if (reduceMotion) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-text-secondary">Giro completado</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto w-fit">
        <motion.div
          className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[20px] border-x-transparent border-t-accent"
          animate={
            done
              ? { scale: 1 }
              : {
                  scale: [1, 1.08, 1],
                  transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        />
        <motion.div
          className="origin-center will-change-transform"
          animate={controls}
          style={{ rotate: rotation }}
        >
          <WheelDisc
            size="lg"
            segments={config.segments}
            backgroundImageUrl={config.backgroundImageUrl}
            centerLogoUrl={config.centerLogoUrl}
          />
        </motion.div>
      </div>
      <p className="text-sm text-text-secondary">{done ? '¡Listo!' : 'Girando…'}</p>
    </div>
  );
}
