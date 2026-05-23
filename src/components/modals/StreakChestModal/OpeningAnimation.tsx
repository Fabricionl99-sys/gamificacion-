import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../../ui/Button';

type Phase = 'shake' | 'pause' | 'open' | 'prize';

interface OpeningAnimationProps {
  onCollect: () => void;
}

export function OpeningAnimation({ onCollect }: OpeningAnimationProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('shake');

  useEffect(() => {
    if (reduceMotion) {
      setPhase('prize');
      return undefined;
    }
    const t1 = window.setTimeout(() => setPhase('pause'), 320);
    const t2 = window.setTimeout(() => setPhase('open'), 620);
    const t3 = window.setTimeout(() => setPhase('prize'), 1280);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-semibold text-warning">+500 XP</p>
        <Button className="w-full" variant="primary" onClick={onCollect}>
          apreta para recoger
        </Button>
      </div>
    );
  }

  const showGlow = phase !== 'shake';
  const lidOpen = phase === 'open' || phase === 'prize';
  const showPrize = phase === 'prize';

  return (
    <div className="space-y-4">
      <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-lg bg-[radial-gradient(circle,var(--coins-glow),transparent_60%)]">
        <motion.div
          className="absolute h-28 w-28 rounded-full bg-warning/20 blur-2xl"
          animate={{
            opacity: showGlow ? [0.35, 0.85, 0.5] : 0.25,
            scale: showGlow ? [0.9, 1.25, 1] : 0.85,
          }}
          transition={{ duration: 0.45 }}
        />

        <motion.div
          className="relative [perspective:800px]"
          animate={
            phase === 'shake'
              ? { x: [0, -9, 9, -9, 9, -6, 6, 0] }
              : { x: 0 }
          }
          transition={
            phase === 'shake'
              ? { duration: 0.32, ease: 'easeInOut' }
              : { duration: 0.15 }
          }
        >
          <motion.div
            className="relative h-24 w-32 rounded-b-lg border border-warning/30 bg-gradient-to-br from-warning/80 to-coins/40 shadow-card"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute -top-8 left-2 z-10 h-10 w-28 origin-top rounded-t-lg border border-warning/40 bg-warning/70"
              animate={{ rotateX: lidOpen ? -108 : 0 }}
              transition={{ duration: 0.55, ease: [0.34, 1.45, 0.64, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            />
            <div className="flex h-full items-end justify-center pb-3">
              {!showPrize ? (
                <motion.div
                  className="h-3 w-20 rounded-full bg-warning/40 blur-sm"
                  animate={{ opacity: showGlow ? [0.4, 1, 0.55] : 0.3, scaleY: showGlow ? [0.7, 1.15, 0.85] : 0.7 }}
                  transition={{ duration: 0.35 }}
                />
              ) : null}
            </div>
          </motion.div>

          {showPrize ? (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2"
              initial={{ y: 12, scale: 0.4, opacity: 0 }}
              animate={{ y: -56, scale: [0.4, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Star className="h-12 w-12 fill-warning text-warning drop-shadow-[0_0_12px_var(--warning-glow)]" />
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      {showPrize ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-3 text-center text-sm font-semibold text-warning">+500 XP · cofre de racha</p>
          <Button className="w-full" variant="primary" onClick={onCollect}>
            apreta para recoger
          </Button>
        </motion.div>
      ) : (
        <p className="text-center text-metadata text-text-tertiary">Abriendo cofre…</p>
      )}
    </div>
  );
}
