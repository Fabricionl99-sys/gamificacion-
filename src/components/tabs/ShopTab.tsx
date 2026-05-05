import { Lock, PackageX, ShoppingBag, Shirt, Sparkles, Timer, Zap } from 'lucide-react';

import { getPlayer } from '../../api/player';
import { getShopItems } from '../../api/shop';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import type { Player, VipTier } from '../../types/player';
import type { ShopIcon, ShopItem } from '../../types/reward';
import { formatNumber, formatTimeRemaining } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';
import { tabEmptyStates } from './emptyStateConfig';

const iconMap = {
  box: ShoppingBag,
  sparkles: Sparkles,
  zap: Zap,
  shirt: Shirt,
} satisfies Record<ShopIcon, typeof Sparkles>;

const categoryLabels = {
  operatorBonus: 'Bonos del operador',
  gamification: 'Items de gamificacion',
  physical: 'Productos fisicos',
};

const vipOrder = ['none', 'bronze', 'silver', 'gold', 'diamond'];
const canUseVip = (player: Player | undefined, required: Exclude<VipTier, 'none'> | null) =>
  !required || vipOrder.indexOf(player?.vipTier ?? 'none') >= vipOrder.indexOf(required);
const isExpired = (item: ShopItem) => Boolean(item.endsAt && new Date(item.endsAt).getTime() <= Date.now());
const isUrgent = (item: ShopItem) => Boolean(item.endsAt && new Date(item.endsAt).getTime() - Date.now() < 86400000);

function ProductBadges({ item, locked }: { item: ShopItem; locked: boolean }) {
  const badges = [];
  if (item.stock === 0) badges.push(<Badge key="sold-out" tone="danger"><PackageX className="h-3 w-3" />agotado</Badge>);
  else if (typeof item.stock === 'number' && item.stock <= item.lowStockThreshold) badges.push(<Badge key="stock" tone="warning">🔥 quedan {item.stock} unidades</Badge>);
  if (item.vipRequired) badges.push(<Badge key="vip" tone="vip">{locked && <Lock className="h-3 w-3" />}VIP {item.vipRequired}+{locked ? ' · bloqueado' : ''}</Badge>);
  if (item.endsAt) badges.push(<Badge key="time" tone={isUrgent(item) ? 'danger' : 'info'} className={isUrgent(item) ? 'animate-pulse' : undefined}><Timer className="h-3 w-3" />termina en {formatTimeRemaining(item.endsAt)}</Badge>);
  return badges.length ? <div className="mt-3 flex flex-wrap gap-1.5">{badges}</div> : null;
}

export default function ShopTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const { data: player } = useAsyncData(getPlayer);
  const { data: shopItems, isLoading, error } = useAsyncData(getShopItems, []);
  const categories = Object.entries(categoryLabels);
  const items = (shopItems ?? []).filter((item) => !isExpired(item));

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <EmptyState icon={<ShoppingBag className="h-8 w-8" />} title="No pudimos cargar la tienda" description="Intentá de nuevo en unos minutos." />;

  if (items.length === 0) {
    return <EmptyState icon={tabEmptyStates.shop.icon} title={tabEmptyStates.shop.title} description={tabEmptyStates.shop.description} />;
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between bg-coins text-bg-primary">
        <span className="text-sm font-medium">tu saldo</span>
        <span className="text-xl font-semibold tracking-tight">{formatNumber(player?.coins ?? 0)} monedas</span>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {items.filter((item) => item.featured).map((item) => (
          <Card key={item.id} variant="neon" className="scan-effect">
            <Badge variant="warning">destacado</Badge>
            <h3 className="mt-3 text-md font-semibold text-text-primary">{item.name}</h3>
            <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            <ProductBadges item={item} locked={!canUseVip(player, item.vipRequired)} />
          </Card>
        ))}
      </div>

      {categories.map(([category, label]) => (
        <section key={category} className="space-y-3">
          <SectionHeader title={label} actionLabel={category === 'gamification' ? 'probar caja' : undefined} onAction={category === 'gamification' ? () => openModal('mysteryBox') : undefined} />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.filter((item) => item.category === category).map((item) => {
              const Icon = iconMap[item.icon];
              const vipLocked = !canUseVip(player, item.vipRequired);
              const soldOut = item.stock === 0;
              const insufficientBalance = (player?.coins ?? 0) < item.cost;
              const disabled = soldOut || vipLocked || insufficientBalance || Boolean(item.disabledReason);
              const reason = soldOut ? 'agotado' : vipLocked ? `subí a VIP ${item.vipRequired} para canjear` : item.disabledReason ?? 'saldo insuficiente';
              const modal = item.icon === 'box' ? 'mysteryBox' : item.icon === 'zap' ? 'levelUp' : 'purchase';
              return (
                <Card key={item.id} className={disabled ? 'opacity-60' : undefined}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-bg-tertiary text-coins">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                      <ProductBadges item={item} locked={vipLocked} />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-md font-semibold text-coins">{formatNumber(item.cost)}</span>
                        <Button size="sm" variant={disabled ? 'secondary' : 'primary'} disabled={disabled} title={vipLocked ? `Subí a VIP ${item.vipRequired} para canjear` : undefined} onClick={() => openModal(modal)}>
                          {disabled ? reason : 'canjear'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
