import { useState } from 'react';

import { useModalsStore } from '../../../store/modalsStore';
import { useRewardsInventoryStore } from '../../../store/rewardsInventoryStore';
import { Modal } from '../../ui/Modal';
import { OpeningAnimation } from './OpeningAnimation';
import { PreOpenView } from './PreOpenView';

export default function StreakChestModal() {
  const { activeModal, closeModal } = useModalsStore();
  const selectedChest = useRewardsInventoryStore((s) => s.selectedChest);
  const setSelectedChest = useRewardsInventoryStore((s) => s.setSelectedChest);
  const [opened, setOpened] = useState(false);

  const handleClose = () => {
    setOpened(false);
    setSelectedChest(null);
    closeModal();
  };

  return (
    <Modal
      isOpen={activeModal === 'streakChest'}
      onClose={handleClose}
      title={selectedChest?.name ?? selectedChest?.title ?? 'cofre de racha'}
    >
      {opened ? (
        <OpeningAnimation onCollect={handleClose} />
      ) : (
        <PreOpenView
          title={selectedChest?.name ?? selectedChest?.title ?? 'Cofre listo'}
          description={selectedChest?.description ?? 'Tu cofre está listo para abrir.'}
          onOpen={() => setOpened(true)}
        />
      )}
    </Modal>
  );
}
