import { motion, useReducedMotion } from 'framer-motion';
import { Coins, Gift, Sparkles, Star, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

import { buildCaseReelKeyframes } from '../../../lib/caseReel';

const prizes: { label: string; icon: LucideIcon; tone: string }[] = [
  { label: '+50 XP', icon: Star, tone: 'from-violet-500/20 to-bg-tertiary' },
  { label: '15 free spins', icon: Sparkles, tone: 'from-coins/25 to-bg-tertiary' },
  { label: '+450 monedas', icon: Coins, tone: 'from-accent/25 to-bg-tertiary' },
  { label: 'x2 XP 1h', icon: Zap, tone: 'from-warning/20 to-bg-tertiary' },
  { label: 'bono sorpresa', icon: Gift, tone: 'from-info/20 to-bg-tertiary' },
];

/** Premio mock — en prod lo define el server antes de animar. */
const WIN_INDEX = 2;

interface AnimationViewProps {
  onSkip: () => void;
  onComplete?: () => void;
}

export function AnimationView({ onSkip, onComplete }: AnimationViewProps) {
  const reduceMotion = useReducedMotion();
  const reel = useMemo(
    () => [...prizes, ...prizes, ...prizes, ...prizes, ...prizes],
    [],
  );
  const keyframes = useMemo(
    () => buildCaseReelKeyframes(WIN_INDEX, prizes.length, { minFullLoops: 2 }),
    [],
  );

  if (reduceMotion) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-text-secondary">+450 monedas</p>
        <button type="button" className="text-xs text-accent" onClick={onSkip}>
          continuar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">abriendo caja</p>
      <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-[radial-gradient(circle_at_top,rgba(10,247,132,0.12),rgba(10,14,19,0.95))] py-6 shadow-glow">
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-[3px] -translate-x-1/2 bg-accent shadow-glow" />
        <motion.div
          className="flex gap-3 px-6 will-change-transform"
          initial={{ x: 0 }}
          animate={{ x: keyframes.x }}
          transition={{
            duration: keyframes.durationS,
            times: keyframes.times,
            ease: ['easeIn', 'linear', [0.12, 0.75, 0.15, 1], [0.34, 1.2, 0.64, 1], [0.22, 1, 0.36, 1]],
          }}
          onAnimationComplete={onComplete}
        >
          {reel.map((prize, index) => {
            const Icon = prize.icon;
            return (
              <div
                key={`${prize.label}-${index}`}
                className={`min-w-[7.5rem] shrink-0 rounded-xl border border-border-accent/40 bg-gradient-to-b ${prize.tone} p-4 shadow-card`}
                style={{ width: 120 }}
              >
                <Icon className="mx-auto h-8 w-8 text-accent" />
                <p className="mt-2 text-xs font-semibold text-text-primary">{prize.label}</p>
              </div>
            );
          })}
        </motion.div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg-primary to-transparent" />
      </div>
      <button
        className="text-xs font-semibold text-text-secondary hover:text-text-primary"
        type="button"
        onClick={onSkip}
      >
        saltar animacion
      </button>
    </div>
  );
}
