import { Trophy } from 'lucide-react';

import { useModalsStore } from '../../store/modalsStore';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';

const prizes = ['Top 1 · $1,000 + 500 XP', 'Top 2-5 · caja premium', 'Top 6-10 · 150 monedas'];

export default function DivisionPrizesModal() {
  const { activeModal, closeModal } = useModalsStore();
  return (
    <Modal isOpen={activeModal === 'divisionPrizes'} onClose={closeModal} title="premios de liga oro">
      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <Card key={prize} className="flex items-center gap-3">
            <Trophy className={index === 0 ? 'h-5 w-5 text-coins' : 'h-5 w-5 text-text-tertiary'} />
            <p className="text-sm font-medium text-text-primary">{prize}</p>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
