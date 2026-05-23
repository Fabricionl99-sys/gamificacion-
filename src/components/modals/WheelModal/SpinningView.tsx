import { useEffect, useState } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';

import {
  WHEEL_SPIN_DURATION_S,
  WHEEL_SPIN_EASE,
  WHEEL_SPIN_POST_STOP_MS,
  computeWheelLandDelta,
} from '../../../lib/wheelSpin';
import { WheelDisc } from './WheelDisc';

const wheelSegments = ['50 XP', 'bono', 'x2', 'coins', 'caja', 'free bet', 'racha', 'misterio'];
const PRIZE_INDEX = 0;

function wait(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
}

interface SpinningViewProps {
  onComplete: () => void;
}

export function SpinningView({ onComplete }: SpinningViewProps) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      void wait(400).then(onComplete);
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      const landDelta = computeWheelLandDelta(PRIZE_INDEX, rotation);
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
      if (!cancelled) onComplete();
    };

    void run();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- single spin on mount
  }, [controls, onComplete, reduceMotion]);

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
          <WheelDisc size="lg" centerLabel={done ? 'listo' : 'girando'} />
        </motion.div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {wheelSegments.map((segment) => (
          <span key={segment} className="rounded-sm bg-bg-tertiary px-2 py-1 text-metadata text-text-secondary">
            {segment}
          </span>
        ))}
      </div>
    </div>
  );
}
