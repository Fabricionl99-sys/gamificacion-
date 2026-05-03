import { useState } from 'react';

import { Modal } from '../../ui/Modal';
import { useModalsStore } from '../../../store/modalsStore';
import { PreSpinView } from './PreSpinView';
import { ResultView } from './ResultView';
import { SpinningView } from './SpinningView';

type Phase = 'pre' | 'spin' | 'result';

export default function WheelModal() {
  const { activeModal, closeModal } = useModalsStore();
  const [phase, setPhase] = useState<Phase>('pre');
  const isOpen = activeModal === 'wheel';

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="rueda de la fortuna">
      {phase === 'pre' ? <PreSpinView onSpin={() => setPhase('spin')} /> : null}
      {phase === 'spin' ? <SpinningView onComplete={() => setPhase('result')} /> : null}
      {phase === 'result' ? <ResultView onCollect={closeModal} /> : null}
    </Modal>
  );
}
