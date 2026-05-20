import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';

import {
  WHEEL_SPIN_DURATION_S,
  WHEEL_SPIN_POST_STOP_MS,
  buildSpinRotationKeyframes,
  computeWheelLandDelta,
} from '../../../lib/wheelSpin';

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
  const wobbleControls = useAnimation();
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      void wait(400).then(onComplete);
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      void wobbleControls.start({
        rotate: [0, 1, -1, 0.8, -0.8, 0],
        transition: { duration: 0.11, repeat: Infinity, ease: 'linear' },
      });

      const landDelta = computeWheelLandDelta(PRIZE_INDEX, rotation);
      const keyframes = buildSpinRotationKeyframes(rotation, landDelta);
      const finalRot = keyframes[keyframes.length - 1]!;

      await controls.start({
        rotate: keyframes,
        transition: {
          duration: WHEEL_SPIN_DURATION_S,
          times: [0, 0.06, 0.4, 0.91, 0.97, 1],
          ease: [
            [0.35, 0, 1, 1],
            'linear',
            [0.17, 0.67, 0.21, 0.98],
            [0.33, 1.35, 0.58, 1],
            [0.22, 1, 0.36, 1],
          ],
        },
      });

      wobbleControls.stop();
      void wobbleControls.set({ rotate: 0 });
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
  }, [controls, wobbleControls, onComplete, reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-text-secondary">Giro completado</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto h-56 w-56">
        <motion.div
          className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[20px] border-x-transparent border-t-accent"
          animate={
            done
              ? { scale: 1 }
              : {
                  scale: [1, 1.12, 1],
                  filter: [
                    'drop-shadow(0 0 0 transparent)',
                    'drop-shadow(0 0 10px var(--accent-primary))',
                    'drop-shadow(0 0 0 transparent)',
                  ],
                }
          }
          transition={done ? { duration: 0.2 } : { duration: 0.55, repeat: Infinity }}
        />
        <motion.div ref={wheelRef} animate={wobbleControls} style={{ rotate: 0 }}>
          <motion.div
            className="grid h-full w-full place-items-center rounded-full border border-border-accent bg-wheel-segments shadow-card will-change-transform"
            animate={controls}
            style={{ rotate: rotation }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full border border-border-default bg-bg-primary text-sm font-semibold text-text-secondary">
              {done ? 'listo' : 'girando'}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {wheelSegments.map((segment) => (
          <span key={segment} className="rounded-sm bg-bg-tertiary px-2 py-1 text-xs text-text-secondary">
            {segment}
          </span>
        ))}
      </div>
    </div>
  );
}
