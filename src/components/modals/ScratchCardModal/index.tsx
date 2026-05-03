import { useState } from 'react';

import { Modal } from '../../ui/Modal';
import { useModalsStore } from '../../../store/modalsStore';
import { PreScratchView } from './PreScratchView';
import { ScratchCanvas } from './ScratchCanvas';

export default function ScratchCardModal() {
  const { activeModal, closeModal } = useModalsStore();
  const [phase, setPhase] = useState<'pre' | 'scratch'>('pre');
  const isOpen = activeModal === 'scratchCard';

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="raspadita">
      {phase === 'pre' ? <PreScratchView onStart={() => setPhase('scratch')} /> : <ScratchCanvas onComplete={closeModal} />}
    </Modal>
  );
}
