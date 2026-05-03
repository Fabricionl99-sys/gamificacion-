import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function SurprisePhase() {
  return (
    <div className="grid place-items-center py-8">
      <motion.div
        animate={{ scale: [1, 1.16, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="grid h-24 w-24 place-items-center rounded-full bg-accent-subtle shadow-glow"
      >
        <Star className="h-12 w-12 text-accent" />
      </motion.div>
    </div>
  );
}
