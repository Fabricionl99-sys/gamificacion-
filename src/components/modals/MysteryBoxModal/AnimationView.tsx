import { motion } from 'framer-motion';
import { Gift, Sparkles, Star } from 'lucide-react';

const prizes = [
  { label: '+50 XP', icon: Star },
  { label: 'free spins', icon: Sparkles },
  { label: '+300 monedas', icon: Gift },
  { label: 'x2 XP', icon: Star },
  { label: 'bono sorpresa', icon: Gift },
];

interface AnimationViewProps {
  onSkip: () => void;
  onComplete?: () => void;
}

export function AnimationView({ onSkip, onComplete }: AnimationViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="relative overflow-hidden rounded-xl border border-border-default bg-bg-secondary py-8">
        <div className="absolute left-1/2 top-0 z-10 h-full w-[2px] -translate-x-1/2 bg-accent shadow-glow" />
        <motion.div
          className="flex gap-3"
          animate={{ x: ['0%', '-130%'] }}
          transition={{ duration: 3.8, ease: [0.25, 0.1, 0.25, 1] }}
          onAnimationComplete={onComplete}
        >
          {[...prizes, ...prizes, ...prizes].map((prize, index) => {
            const Icon = prize.icon;
            return (
              <div key={`${prize.label}-${index}`} className="min-w-28 rounded-lg bg-bg-tertiary p-4">
                <Icon className="mx-auto h-8 w-8 text-coins" />
                <p className="mt-2 text-sm font-semibold text-text-primary">{prize.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
      <button className="text-xs font-semibold text-text-secondary hover:text-text-primary" type="button" onClick={onSkip}>
        saltar animacion
      </button>
    </div>
  );
}
