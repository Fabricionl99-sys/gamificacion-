import type { LucideIcon } from 'lucide-react';
import { Lock, PackageX, ShoppingBag, Shirt, Sparkles, Timer, Zap } from 'lucide-react';

import type { Player, VipTier } from '../../types/player';
import type { ShopIcon, ShopItem } from '../../types/reward';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const iconMap = {
  box: ShoppingBag,
  sparkles: Sparkles,
  zap: Zap,
  shirt: Shirt,
} satisfies Record<ShopIcon, LucideIcon>;

const vipOrder = ['none', 'bronze', 'silver', 'gold', 'diamond'];

export function canUseVip(player: Player | undefined, required: Exclude<VipTier, 'none'> | null) {
  return !required || vipOrder.indexOf(player?.vipTier ?? 'none') >= vipOrder.indexOf(required);
}

export function getShopItemState(item: ShopItem, player: Player | undefined) {
  const vipLocked = !canUseVip(player, item.vipRequired);
  const soldOut = item.stock === 0;
  const insufficientBalance = (player?.coins ?? 0) < item.cost;
  const disabled = soldOut || vipLocked || insufficientBalance || Boolean(item.disabledReason);
  const reason = soldOut
    ? 'agotado'
    : vipLocked
      ? `VIP ${item.vipRequired}`
      : item.disabledReason ?? 'sin saldo';
  return { vipLocked, soldOut, disabled, reason };
}

function ProductBadges({ item, locked }: { item: ShopItem; locked: boolean }) {
  const badges = [];
  if (item.featured) badges.push(<Badge key="featured" tone="warning">destacado</Badge>);
  if (item.stock === 0) {
    badges.push(
      <Badge key="sold-out" tone="danger">
        <PackageX className="h-3 w-3" />
        agotado
      </Badge>,
    );
  } else if (typeof item.stock === 'number' && item.stock <= item.lowStockThreshold) {
    badges.push(
      <Badge key="stock" tone="warning">
        quedan {item.stock}
      </Badge>,
    );
  }
  if (item.vipRequired) {
    badges.push(
      <Badge key="vip" tone="vip">
        {locked ? <Lock className="h-3 w-3" /> : null}
        VIP {item.vipRequired}+
      </Badge>,
    );
  }
  if (item.endsAt) {
    const urgent = new Date(item.endsAt).getTime() - Date.now() < 86400000;
    badges.push(
      <Badge key="time" tone={urgent ? 'danger' : 'info'} className={urgent ? 'animate-pulse' : undefined}>
        <Timer className="h-3 w-3" />
        {formatTimeRemaining(item.endsAt)}
      </Badge>,
    );
  }
  return badges.length ? <div className="mt-2 flex flex-wrap gap-1.5">{badges}</div> : null;
}

interface ShopProductCardProps {
  item: ShopItem;
  player: Player | undefined;
  onDetail: (item: ShopItem) => void;
  onRedeem: (item: ShopItem) => void;
  onNotify?: (item: ShopItem) => void;
  onVipInfo?: (item: ShopItem) => void;
}

export function ShopProductCard({ item, player, onDetail, onRedeem, onNotify, onVipInfo }: ShopProductCardProps) {
  const Icon = iconMap[item.icon];
  const { vipLocked, soldOut, disabled, reason } = getShopItemState(item, player);

  return (
    <Card className={disabled ? 'opacity-80' : undefined}>
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border-default bg-bg-tertiary">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center text-coins">
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-module-body leading-relaxed text-text-secondary">{item.description}</p>
          <ProductBadges item={item} locked={vipLocked} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
        <span className="text-sm font-semibold text-coins">
          {formatNumber(item.cost)}
          {item.currencyCode ? ` ${item.currencyCode}` : ' monedas'}
        </span>
        <ProductActions
          item={item}
          soldOut={soldOut}
          vipLocked={vipLocked}
          disabled={disabled}
          reason={reason}
          onDetail={onDetail}
          onRedeem={onRedeem}
          onNotify={onNotify}
          onVipInfo={onVipInfo}
        />
      </div>
    </Card>
  );
}

function ProductActions({
  item,
  soldOut,
  vipLocked,
  disabled,
  reason,
  onDetail,
  onRedeem,
  onNotify,
  onVipInfo,
}: {
  item: ShopItem;
  soldOut: boolean;
  vipLocked: boolean;
  disabled: boolean;
  reason: string;
  onDetail: (item: ShopItem) => void;
  onRedeem: (item: ShopItem) => void;
  onNotify?: (item: ShopItem) => void;
  onVipInfo?: (item: ShopItem) => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <Button size="sm" variant="ghost" onClick={() => onDetail(item)}>
        ver detalle
      </Button>
      {soldOut ? (
        <Button size="sm" variant="secondary" onClick={() => onNotify?.(item)}>
          avisame
        </Button>
      ) : vipLocked ? (
        <Button size="sm" variant="secondary" onClick={() => onVipInfo?.(item)}>
          ver VIP
        </Button>
      ) : null}
      <Button size="sm" variant={disabled ? 'secondary' : 'primary'} disabled={disabled} onClick={() => onRedeem(item)}>
        {disabled ? reason : 'canjear'}
      </Button>
    </div>
  );
}
