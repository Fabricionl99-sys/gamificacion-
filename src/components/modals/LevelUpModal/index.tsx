import { useEffect, useState } from 'react';

import { Modal } from '../../ui/Modal';
import { useModalsStore } from '../../../store/modalsStore';
import { RecognitionPhase } from './RecognitionPhase';
import { RewardPhase } from './RewardPhase';
import { SurprisePhase } from './SurprisePhase';

export default function LevelUpModal() {
  const { activeModal, closeModal } = useModalsStore();
  const [phase, setPhase] = useState(0);
  const isOpen = activeModal === 'levelUp';

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      return;
    }
    const timers = [window.setTimeout(() => setPhase(1), 600), window.setTimeout(() => setPhase(2), 2800)];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="level up" description="reconocimiento y recompensa con stagger">
      {phase === 0 ? <SurprisePhase /> : null}
      {phase === 1 ? <RecognitionPhase /> : null}
      {phase === 2 ? <RewardPhase onCollect={closeModal} /> : null}
    </Modal>
  );
}
