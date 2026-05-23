import { AlertTriangle, Clock } from 'lucide-react';

import { usePlayer } from '../../hooks/usePlayer';
import { useToast } from '../../hooks/useToast';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useModalsStore } from '../../store/modalsStore';
import { useShopStore } from '../../store/shopStore';
import type { ShopItem } from '../../types/reward';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { getShopItemState } from '../shop/ShopProductCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

export default function ShopItemDetailModal() {
  const { activeModal, closeModal, openModal } = useModalsStore();
  const selectedItem = useShopStore((state) => state.selectedItem);
  const setSelectedItem = useShopStore((state) => state.setSelectedItem);
  const { player } = usePlayer();
  const toast = useToast();
  const { route, closeDetail } = useWidgetNavigation();

  const handleClose = () => {
    closeModal();
    if (route.tab === 'shop' && route.detailId) {
      closeDetail('shop');
    }
  };

  if (!selectedItem) return null;

  const { disabled, reason, vipLocked, soldOut } = getShopItemState(selectedItem, player);
  const isLowStock =
    selectedItem.stock !== null && selectedItem.stock > 0 && selectedItem.stock <= selectedItem.lowStockThreshold;

  const handleRedeem = () => {
    if (disabled) return;
    closeModal();
    setSelectedItem(selectedItem);
    openModal(selectedItem.icon === 'box' ? 'mysteryBox' : 'purchase');
  };

  return (
    <Modal isOpen={activeModal === 'shopDetail'} onClose={handleClose} title={selectedItem.name} description="detalle del producto">
      <DetailBody item={selectedItem} playerCoins={player?.coins ?? 0} vipLocked={vipLocked} isLowStock={isLowStock} />
      <DetailActions
        soldOut={soldOut}
        vipLocked={vipLocked}
        disabled={disabled}
        reason={reason}
        vipRequired={selectedItem.vipRequired}
        onClose={handleClose}
        onRedeem={handleRedeem}
        onNotify={() => toast.info('Te avisaremos cuando vuelva el stock')}
        onVipInfo={() => toast.info(`Necesitás VIP ${selectedItem.vipRequired} o superior`)}
      />
    </Modal>
  );
}

function DetailBody({
  item,
  playerCoins,
  vipLocked,
  isLowStock,
}: {
  item: ShopItem;
  playerCoins: number;
  vipLocked: boolean;
  isLowStock: boolean;
}) {
  return (
    <Card className="space-y-4">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="h-40 w-full rounded-lg border border-border-default object-cover" />
      ) : null}
      <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
      <div className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
        costo: <span className="font-semibold text-coins">{formatNumber(item.cost)}</span> · saldo restante:{' '}
        <span className="font-semibold text-text-primary">{formatNumber(playerCoins - item.cost)}</span>
      </div>
      {item.endsAt ? (
        <Badge tone="info" className="normal-case tracking-normal">
          <Clock className="h-3 w-3" /> termina en {formatTimeRemaining(item.endsAt)}
        </Badge>
      ) : null}
      {item.vipRequired ? (
        <Badge tone="vip" className="normal-case tracking-normal">
          VIP {item.vipRequired}+ {vipLocked ? '· bloqueado' : ''}
        </Badge>
      ) : null}
      {isLowStock ? (
        <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-metadata text-warning">
          <AlertTriangle className="h-4 w-4" />
          quedan pocas unidades, podría agotarse
        </div>
      ) : null}
    </Card>
  );
}

function DetailActions({
  soldOut,
  vipLocked,
  disabled,
  reason,
  vipRequired,
  onClose,
  onRedeem,
  onNotify,
  onVipInfo,
}: {
  soldOut: boolean;
  vipLocked: boolean;
  disabled: boolean;
  reason: string;
  vipRequired: ShopItem['vipRequired'];
  onClose: () => void;
  onRedeem: () => void;
  onNotify: () => void;
  onVipInfo: () => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Button variant="secondary" onClick={onClose}>
        cerrar
      </Button>
      {soldOut ? (
        <Button variant="secondary" onClick={onNotify}>
          avisame
        </Button>
      ) : vipLocked ? (
        <Button variant="secondary" onClick={onVipInfo}>
          ver VIP {vipRequired}
        </Button>
      ) : (
        <Button variant="primary" disabled={disabled} onClick={onRedeem}>
          {disabled ? reason : 'canjear'}
        </Button>
      )}
    </div>
  );
}
