import { useMemo, useState } from 'react';

import { Modal } from '../../ui/Modal';
import { useModalsStore } from '../../../store/modalsStore';
import { DEMO_WHEEL_VISUAL } from '../../../mocks/data/wheelCatalog';
import type { WheelSegmentDisplay, WheelVisualConfig } from '../../../lib/wheelDisplay';
import { PreSpinView } from './PreSpinView';
import { ResultView } from './ResultView';
import { SpinningView } from './SpinningView';

type Phase = 'pre' | 'spin' | 'result';

export default function WheelModal() {
  const { activeModal, closeModal } = useModalsStore();
  const [phase, setPhase] = useState<Phase>('pre');
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegmentDisplay | null>(null);
  const isOpen = activeModal === 'wheel';

  const config: WheelVisualConfig = useMemo(() => DEMO_WHEEL_VISUAL, []);

  const handleClose = () => {
    setPhase('pre');
    setPrizeIndex(0);
    setWonPrize(null);
    closeModal();
  };

  const startSpin = () => {
    const idx = Math.floor(Math.random() * config.segments.length);
    setPrizeIndex(idx);
    setPhase('spin');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="rueda de la fortuna">
      {phase === 'pre' ? <PreSpinView config={config} onSpin={startSpin} /> : null}
      {phase === 'spin' ? (
        <SpinningView
          config={config}
          prizeIndex={prizeIndex}
          onComplete={(won) => {
            setWonPrize(won);
            setPhase('result');
          }}
        />
      ) : null}
      {phase === 'result' && wonPrize ? (
        <ResultView prize={wonPrize} onCollect={handleClose} />
      ) : null}
    </Modal>
  );
}
