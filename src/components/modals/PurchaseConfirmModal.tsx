import { AlertTriangle, Clock, Sparkles } from 'lucide-react';

import { getPlayer } from '../../api/player';
import { getShopItems } from '../../api/shop';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export default function PurchaseConfirmModal() {
  const { activeModal, closeModal } = useModalsStore();
  const { data: items = [] } = useAsyncData(getShopItems, []);
  const { data: player } = useAsyncData(getPlayer);
  const item = items.find((entry) => entry.stock !== 0 && !entry.vipRequired) ?? items[0];

  if (!item || !player) {
    return null;
  }

  const remaining = player.coins - item.cost;
  const isLowStock = item.stock !== null && item.stock > 0 && item.stock <= item.lowStockThreshold;

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
        {item.endsAt ? (
          <Badge tone="info" className="normal-case tracking-normal">
            <Clock className="h-3 w-3" /> termina en {formatTimeRemaining(item.endsAt)}
          </Badge>
        ) : null}
        {isLowStock ? (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
            <AlertTriangle className="h-4 w-4" />
            quedan pocas unidades, podría agotarse
          </div>
        ) : null}
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
