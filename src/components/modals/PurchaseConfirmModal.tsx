import { AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

import { purchaseShopProduct } from '../../api/shop';
import { usePlayer } from '../../hooks/usePlayer';
import { useToast } from '../../hooks/useToast';
import { useModalsStore } from '../../store/modalsStore';
import { usePlayerStore } from '../../store/playerStore';
import { useShopStore } from '../../store/shopStore';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { getShopItemState } from '../shop/ShopProductCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export default function PurchaseConfirmModal() {
  const { activeModal, closeModal } = useModalsStore();
  const selectedItem = useShopStore((state) => state.selectedItem);
  const setSelectedItem = useShopStore((state) => state.setSelectedItem);
  const { player } = usePlayer();
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedItem || !player) return null;

  const { disabled } = getShopItemState(selectedItem, player);
  const remaining = player.coins - selectedItem.cost;
  const isLowStock =
    selectedItem.stock !== null && selectedItem.stock > 0 && selectedItem.stock <= selectedItem.lowStockThreshold;

  const handleConfirm = async () => {
    if (disabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await purchaseShopProduct(selectedItem.id, crypto.randomUUID());
      if (typeof result.new_balance === 'number') {
        updatePlayer({ coins: result.new_balance });
      } else {
        updatePlayer({ coins: Math.max(0, player.coins - selectedItem.cost) });
      }
      toast.success(`Canjeaste ${selectedItem.name}`);
      setSelectedItem(null);
      closeModal();
    } catch {
      toast.danger('No pudimos completar el canje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'purchase'}
      onClose={closeModal}
      title="confirmar canje"
      description="revisa el costo antes de usar tus monedas"
    >
      <Card className="space-y-3">
        {selectedItem.imageUrl ? (
          <img src={selectedItem.imageUrl} alt="" className="h-28 w-full rounded-lg border border-border-default object-cover" />
        ) : null}
        <div>
          <p className="font-semibold">{selectedItem.name}</p>
          <p className="text-sm text-text-secondary">{selectedItem.description}</p>
        </div>
        <div className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
          costo: <span className="font-semibold text-coins">{formatNumber(selectedItem.cost)}</span> · saldo restante:{' '}
          <span className="font-semibold text-text-primary">{formatNumber(remaining)}</span>
        </div>
        {selectedItem.endsAt ? (
          <Badge tone="info" className="normal-case tracking-normal">
            <Clock className="h-3 w-3" /> termina en {formatTimeRemaining(selectedItem.endsAt)}
          </Badge>
        ) : null}
        {isLowStock ? (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-metadata text-warning">
            <AlertTriangle className="h-4 w-4" />
            quedan pocas unidades, podría agotarse
          </div>
        ) : null}
      </Card>
      <PurchaseActions disabled={disabled} isSubmitting={isSubmitting} onClose={closeModal} onConfirm={handleConfirm} />
    </Modal>
  );
}

function PurchaseActions({
  disabled,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Button variant="secondary" onClick={onClose}>
        cancelar
      </Button>
      <Button variant="primary" disabled={disabled || isSubmitting} isLoading={isSubmitting} onClick={onConfirm}>
        confirmar canje
      </Button>
    </div>
  );
}
