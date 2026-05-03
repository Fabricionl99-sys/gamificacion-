import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '../../ui/Button';

interface OpeningAnimationProps {
  onCollect: () => void;
}

export function OpeningAnimation({ onCollect }: OpeningAnimationProps) {
  return (
    <div className="space-y-4">
    <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-lg bg-[radial-gradient(circle,var(--coins-glow),transparent_60%)]">
      <motion.div
        className="absolute h-28 w-28 rounded-full bg-warning/20 blur-2xl"
        animate={{ scale: [0.8, 1.4, 1], opacity: [0.3, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="relative h-24 w-32 rounded-b-lg border border-warning/30 bg-gradient-to-br from-warning/80 to-coins/40 shadow-card"
        animate={{ y: [8, 0, 8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute -top-8 left-2 h-10 w-28 rounded-t-lg border border-warning/40 bg-warning/70"
          animate={{ rotate: [-4, -22, -10], y: [0, -10, -4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 text-bg-primary"
          animate={{ y: [24, -64], scale: [0.8, 1.3], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        >
          <Star className="h-10 w-10 fill-warning text-warning" />
        </motion.div>
      </motion.div>
    </div>
      <Button className="w-full" variant="primary" onClick={onCollect}>
        apreta para recoger
      </Button>
    </div>
  );
}
