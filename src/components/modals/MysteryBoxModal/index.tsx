import { useState } from 'react';

import { usePlayer } from '../../../hooks/usePlayer';
import { useModalsStore } from '../../../store/modalsStore';
import { usePlayerStore } from '../../../store/playerStore';
import { useShopStore } from '../../../store/shopStore';
import { Modal } from '../../ui/Modal';
import { AnimationView } from './AnimationView';
import { PreOpenView } from './PreOpenView';
import { ResultView } from './ResultView';

type Phase = 'pre' | 'animation' | 'result';

export default function MysteryBoxModal() {
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const selectedItem = useShopStore((state) => state.selectedItem);
  const setSelectedItem = useShopStore((state) => state.setSelectedItem);
  const { player } = usePlayer();
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const [phase, setPhase] = useState<Phase>('pre');
  const isOpen = activeModal === 'mysteryBox';

  const handleClose = () => {
    setPhase('pre');
    setSelectedItem(null);
    closeModal();
  };

  const handleOpen = () => {
    if (selectedItem && player) {
      updatePlayer({ coins: Math.max(0, player.coins - selectedItem.cost) });
    }
    setPhase('animation');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Caja misteriosa"
      description="El server ya determinó el premio; la animación es cosmética."
    >
      {phase === 'pre' ? <PreOpenView onOpen={handleOpen} /> : null}
      {phase === 'animation' ? (
        <AnimationView onComplete={() => setPhase('result')} onSkip={() => setPhase('result')} />
      ) : null}
      {phase === 'result' ? <ResultView onCollect={handleClose} /> : null}
    </Modal>
  );
}
