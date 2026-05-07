import { motion } from 'framer-motion';

import { ProgressBar } from '../../ui/ProgressBar';
import { buildLevelUpHeadline } from '../../notifications/LevelUpToast';
import { usePlayer } from '../../../hooks/usePlayer';

export function RecognitionPhase() {
  const { player } = usePlayer();
  const tiers = player.levelDefinitions ?? [];
  const fromLevel = Math.max(1, player.level - 1);
  const toLevel = player.level;
  const headline = buildLevelUpHeadline(fromLevel, toLevel, tiers);

  return (
    <div className="space-y-5 text-center">
      <div>
        <p className="text-sm font-light italic text-text-primary">nuevo nivel desbloqueado</p>
        <motion.p
          className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {headline}
        </motion.p>
        <p className="mt-2 text-xs text-text-tertiary">
          {fromLevel} → {toLevel}
        </p>
      </div>
      <ProgressBar value={100} ariaLabel="barra de XP completa" />
    </div>
  );
}
