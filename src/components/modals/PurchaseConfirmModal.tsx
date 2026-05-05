import { Sparkles } from 'lucide-react';

import { getPlayer } from '../../api/player';
import { getShopItems } from '../../api/shop';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { formatNumber } from '../../utils/format';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export default function PurchaseConfirmModal() {
  const { activeModal, closeModal } = useModalsStore();
  const { data: items = [] } = useAsyncData(getShopItems, []);
  const { data: player } = useAsyncData(getPlayer);
  const item = items[0] ?? items[1];

  if (!item || !player) {
    return null;
  }

  const remaining = player.coins - item.cost;

  return (
    <Modal
      isOpen={activeModal === 'purchase'}
      onClose={closeModal}
      title="confirmar canje"
      description="revisa el costo antes de usar tus monedas"
    >
      <Card className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-coins/15">
            <Sparkles className="h-6 w-6 text-coins" />
          </div>
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-text-secondary">{item.description}</p>
          </div>
        </div>
        <div className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
          costo: <span className="font-semibold text-coins">{formatNumber(item.cost)}</span> · saldo restante:{' '}
          <span className="font-semibold text-text-primary">{formatNumber(remaining)}</span>
        </div>
      </Card>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={closeModal}>
          cancelar
        </Button>
        <Button variant="primary" onClick={closeModal}>
          confirmar canje
        </Button>
      </div>
    </Modal>
  );
}
