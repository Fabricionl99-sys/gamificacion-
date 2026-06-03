import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

import { getChestDesign, type ChestVisualStyle } from '../../lib/chestDesigns';
import type { ChestOpenPhase } from '../../lib/chestAnimation';

interface FuturisticChestProps {
  style: ChestVisualStyle;
  phase: ChestOpenPhase;
  className?: string;
}

export function FuturisticChest({ style, phase, className = '' }: FuturisticChestProps) {
  const design = getChestDesign(style);
  const shaking = phase === 'shake';
  const lockBreaking = phase === 'lockBreak';
  const lidOpen = phase === 'open' || phase === 'ready' || phase === 'spinning' || phase === 'result';
  const showLock = phase === 'closed' || phase === 'shake' || phase === 'lockBreak';
  const showInnerGlow = lidOpen || phase === 'lockBreak';

  return (
    <div className={`relative grid min-h-[220px] place-items-center ${className}`}>
      <motion.div
        className="absolute h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: design.glow }}
        animate={{
          opacity: showInnerGlow ? [0.35, 0.9, 0.5] : shaking ? [0.2, 0.45, 0.25] : 0.15,
          scale: showInnerGlow ? [0.85, 1.2, 1] : 0.8,
        }}
        transition={{ duration: 0.55, repeat: shaking ? Infinity : 0, repeatType: 'reverse' }}
      />

      <motion.div
        className="relative [perspective:900px]"
        animate={
          shaking
            ? {
                x: [0, -10, 10, -8, 8, -5, 5, 0],
                rotate: [0, -1.5, 1.5, -1, 1, 0],
              }
            : { x: 0, rotate: 0 }
        }
        transition={shaking ? { duration: 0.12, repeat: Infinity, repeatType: 'mirror' } : { duration: 0.2 }}
      >
        {/* Base */}
        <div
          className={`relative h-28 w-40 rounded-b-2xl border-2 bg-gradient-to-b ${design.body} ${design.trim}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Corner accents */}
          <span className="absolute left-2 top-2 h-3 w-3 rounded-sm border border-white/20 bg-white/5" />
          <span className="absolute right-2 top-2 h-3 w-3 rounded-sm border border-white/20 bg-white/5" />

          {/* Lid */}
          <motion.div
            className={`absolute -top-10 left-1 z-20 h-12 w-[9.25rem] origin-top rounded-t-2xl border-2 bg-gradient-to-br ${design.lid} ${design.trim}`}
            animate={{ rotateX: lidOpen ? -115 : 0 }}
            transition={{ duration: 0.65, ease: [0.34, 1.45, 0.64, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="h-1 w-16 rounded-full bg-white/25" />
            </div>
          </motion.div>

          {/* Lock */}
          {showLock ? (
            <motion.div
              className="absolute -top-5 left-1/2 z-30 -translate-x-1/2"
              animate={
                lockBreaking
                  ? { scale: [1, 1.2, 0], rotate: [0, -18, 24], opacity: [1, 1, 0], y: [0, -6, 12] }
                  : { scale: shaking ? [1, 1.06, 1] : 1, opacity: 1 }
              }
              transition={{ duration: lockBreaking ? 0.38 : 0.18, repeat: shaking && !lockBreaking ? Infinity : 0 }}
            >
              <div className={`rounded-lg border border-white/25 bg-black/40 p-2 backdrop-blur-sm ${design.lock}`}>
                <Lock className="h-5 w-5" strokeWidth={2.25} />
              </div>
            </motion.div>
          ) : null}

          {/* Inner chamber */}
          <div className="relative flex h-full items-end justify-center overflow-visible pb-3 pt-6">
            <motion.div
              className={`h-10 w-28 rounded-full bg-gradient-to-t ${design.inner} blur-md`}
              animate={{
                opacity: showInnerGlow ? [0.35, 1, 0.55] : 0.2,
                scaleY: showInnerGlow ? [0.65, 1.25, 0.9] : 0.55,
              }}
              transition={{ duration: 0.45, repeat: showInnerGlow ? Infinity : 0, repeatType: 'reverse' }}
            />
          </div>
        </div>

        {/* Pedestal */}
        <div className="mx-auto mt-1 h-2 w-44 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>
    </div>
  );
}
