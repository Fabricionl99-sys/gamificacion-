import { motion } from 'framer-motion';

import { ProgressBar } from '../../ui/ProgressBar';

export function RecognitionPhase() {
  return (
    <div className="space-y-5 text-center">
      <div>
        <p className="text-sm font-light italic text-text-primary">nuevo nivel desbloqueado</p>
        <motion.p
          className="mt-2 text-3xl font-semibold text-text-primary"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          19 a 20
        </motion.p>
      </div>
      <ProgressBar value={100} ariaLabel="barra de XP completa" />
    </div>
  );
}
