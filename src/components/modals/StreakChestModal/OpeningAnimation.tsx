import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ChestPrizeReel } from '../../chest/ChestPrizeReel';
import { FuturisticChest } from '../../chest/FuturisticChest';
import { Button } from '../../ui/Button';
import { resolveChestVisualStyle } from '../../../lib/chestDesigns';
import { CHEST_OPEN_TIMELINE_MS, type ChestOpenPhase } from '../../../lib/chestAnimation';
import type { ChestOpenResult } from '../../../lib/chestPrizes';

interface OpeningAnimationProps {
  visualStyle?: string | null;
  openResult: ChestOpenResult;
  onCollect: () => void;
}

export function OpeningAnimation({ visualStyle, openResult, onCollect }: OpeningAnimationProps) {
  const reduceMotion = useReducedMotion();
  const style = resolveChestVisualStyle(visualStyle);
  const [phase, setPhase] = useState<ChestOpenPhase>(reduceMotion ? 'ready' : 'shake');

  useEffect(() => {
    if (reduceMotion) return undefined;
    const { shake, lockBreak, lidOpen } = CHEST_OPEN_TIMELINE_MS;
    const t1 = window.setTimeout(() => setPhase('lockBreak'), shake);
    const t2 = window.setTimeout(() => setPhase('open'), shake + lockBreak);
    const t3 = window.setTimeout(() => setPhase('ready'), shake + lockBreak + lidOpen);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  const chestPhase: ChestOpenPhase =
    phase === 'spinning' || phase === 'result' ? 'open' : phase;

  const startSpin = () => setPhase('spinning');

  if (reduceMotion) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-semibold text-accent">{openResult.prize.label}</p>
        <Button className="w-full" variant="primary" onClick={onCollect}>
          apretá para recoger
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {phase !== 'spinning' && phase !== 'result' ? (
        <>
          <FuturisticChest style={style} phase={chestPhase} />
          {phase === 'ready' ? null : (
            <p className="text-center text-metadata text-text-tertiary">
              {phase === 'shake' ? 'El cofre vibra con energía…' : null}
              {phase === 'lockBreak' ? 'Rompiendo candado…' : null}
              {phase === 'open' ? '¡Cofre abierto!' : null}
            </p>
          )}
        </>
      ) : null}

      {(phase === 'ready' || phase === 'spinning' || phase === 'result') && (
        <div className="space-y-4">
          {phase === 'ready' ? (
            <motion.p
              className="text-center text-sm font-medium text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Elegí un premio — tocá girar
            </motion.p>
          ) : null}

          <ChestPrizeReel
            prizes={openResult.prizes}
            winIndex={openResult.prize_index}
            spinning={phase === 'spinning'}
            onSpinComplete={() => setPhase('result')}
          />

          {phase === 'ready' ? (
            <Button className="w-full" variant="primary" leftIcon={<Sparkles className="h-4 w-4" />} onClick={startSpin}>
              girar
            </Button>
          ) : null}

          {phase === 'result' ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
              <p className="text-sm text-text-secondary">Ganaste</p>
              <p className="text-xl font-bold text-accent">{openResult.prize.label}</p>
              <Button className="w-full" variant="primary" onClick={onCollect}>
                apretá para recoger
              </Button>
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
}
