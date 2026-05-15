import { motion } from 'framer-motion';
import { Coins, Gift, Sparkles, Star, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const prizes: { label: string; icon: LucideIcon; tone: string }[] = [
  { label: '+50 XP', icon: Star, tone: 'from-violet-500/20 to-bg-tertiary' },
  { label: '15 free spins', icon: Sparkles, tone: 'from-coins/25 to-bg-tertiary' },
  { label: '+450 monedas', icon: Coins, tone: 'from-accent/25 to-bg-tertiary' },
  { label: 'x2 XP 1h', icon: Zap, tone: 'from-warning/20 to-bg-tertiary' },
  { label: 'bono sorpresa', icon: Gift, tone: 'from-info/20 to-bg-tertiary' },
];

interface AnimationViewProps {
  onSkip: () => void;
  onComplete?: () => void;
}

export function AnimationView({ onSkip, onComplete }: AnimationViewProps) {
  const reel = [...prizes, ...prizes, ...prizes, prizes[2]];

  return (
    <div className="space-y-5 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">abriendo caja</p>
      <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-[radial-gradient(circle_at_top,rgba(10,247,132,0.12),rgba(10,14,19,0.95))] py-6 shadow-glow">
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-[3px] -translate-x-1/2 bg-accent shadow-glow" />
        <motion.div
          className="flex gap-3 px-6"
          animate={{ x: ['0%', '-72%'] }}
          transition={{ duration: 4.2, ease: [0.12, 0.8, 0.2, 1] }}
          onAnimationComplete={onComplete}
        >
          {reel.map((prize, index) => {
            const Icon = prize.icon;
            return (
              <div
                key={`${prize.label}-${index}`}
                className={`min-w-[7.5rem] rounded-xl border border-border-accent/40 bg-gradient-to-b ${prize.tone} p-4 shadow-card`}
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
      <button className="text-xs font-semibold text-text-secondary hover:text-text-primary" type="button" onClick={onSkip}>
        saltar animacion
      </button>
    </div>
  );
}
