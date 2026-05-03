import { useState } from 'react';

import { useModalsStore } from '../../../store/modalsStore';
import { Modal } from '../../ui/Modal';
import { OpeningAnimation } from './OpeningAnimation';
import { PreOpenView } from './PreOpenView';

export default function StreakChestModal() {
  const { activeModal, closeModal } = useModalsStore();
  const [opened, setOpened] = useState(false);

  return (
    <Modal isOpen={activeModal === 'streakChest'} onClose={closeModal} title="cofre de racha">
      {opened ? <OpeningAnimation onCollect={closeModal} /> : <PreOpenView onOpen={() => setOpened(true)} />}
    </Modal>
  );
}
