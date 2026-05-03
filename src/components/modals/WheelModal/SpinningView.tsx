import { useEffect } from 'react';
import { motion } from 'framer-motion';

const wheelSegments = ['50 XP', 'bono', 'x2', 'coins', 'caja', 'free bet', 'racha', 'misterio'];

interface SpinningViewProps {
  onComplete: () => void;
}

export function SpinningView({ onComplete }: SpinningViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 4200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto h-56 w-56">
        <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[20px] border-x-transparent border-t-accent" />
        <motion.div
          className="grid h-full w-full place-items-center rounded-full border border-border-accent bg-wheel-segments shadow-card"
          animate={{ rotate: 1280 }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full border border-border-default bg-bg-primary text-sm font-semibold">
            girando
          </div>
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
