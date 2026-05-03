import { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { useModalsStore } from '../../../store/modalsStore';
import { AnimationView } from './AnimationView';
import { PreOpenView } from './PreOpenView';
import { ResultView } from './ResultView';

type Phase = 'pre' | 'animation' | 'result';

export default function MysteryBoxModal() {
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const [phase, setPhase] = useState<Phase>('pre');
  const isOpen = activeModal === 'mysteryBox';

  const handleClose = () => {
    setPhase('pre');
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Caja misteriosa" description="El server ya determino el premio; la animacion es cosmetica.">
      {phase === 'pre' ? <PreOpenView onOpen={() => setPhase('animation')} /> : null}
      {phase === 'animation' ? <AnimationView onComplete={() => setPhase('result')} /> : null}
      {phase === 'result' ? <ResultView onCollect={handleClose} /> : null}
    </Modal>
  );
}
