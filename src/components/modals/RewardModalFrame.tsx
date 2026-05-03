import type { ReactNode } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useModalsStore } from '../../store/modalsStore';
import type { ModalName } from '../../store/modalsStore';

interface RewardModalFrameProps {
  modal: ModalName;
  title: string;
  description: string;
  children: ReactNode;
  actionLabel?: string;
}

export function RewardModalFrame({ modal, title, description, children, actionLabel = 'apreta para recoger' }: RewardModalFrameProps) {
  const { activeModal, closeModal } = useModalsStore();
  return (
    <Modal isOpen={activeModal === modal} onClose={closeModal} title={title} description={description}>
      <div className="space-y-5 text-center">
        {children}
        <Button variant="primary" className="w-full" onClick={closeModal}>
          {actionLabel}
        </Button>
      </div>
    </Modal>
  );
}
