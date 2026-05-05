import { Box, ShoppingBag, Shirt, Sparkles, Zap } from 'lucide-react';

import { getPlayer } from '../../api/player';
import { getShopItems } from '../../api/shop';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import type { ShopIcon } from '../../types/reward';
import { formatNumber } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';
import { tabEmptyStates } from './emptyStateConfig';

const iconMap = {
  box: Box,
  sparkles: Sparkles,
  zap: Zap,
  shirt: Shirt,
} satisfies Record<ShopIcon, typeof Sparkles>;

const categoryLabels = {
  operatorBonus: 'Bonos del operador',
  gamification: 'Items de gamificacion',
  physical: 'Productos fisicos',
};

export default function ShopTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const { data: player } = useAsyncData(getPlayer);
  const { data: shopItems, isLoading, error } = useAsyncData(getShopItems, []);
  const categories = Object.entries(categoryLabels);
  const items = shopItems ?? [];

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <EmptyState icon={<ShoppingBag className="h-8 w-8" />} title="No pudimos cargar la tienda" description="Intentá de nuevo en unos minutos." />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={tabEmptyStates.shop.icon}
        title={tabEmptyStates.shop.title}
        description={tabEmptyStates.shop.description}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between bg-coins text-bg-primary">
        <span className="text-sm font-medium">tu saldo</span>
        <span className="text-xl font-semibold tracking-tight">{formatNumber(player?.coins ?? 0)} monedas</span>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {items
          .filter((item) => item.featured)
          .map((item) => (
            <Card key={item.id} variant="neon" className="scan-effect">
              <Badge variant="warning">destacado</Badge>
              <h3 className="mt-3 text-md font-semibold text-text-primary">{item.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            </Card>
          ))}
      </div>

      {categories.map(([category, label]) => (
        <section key={category} className="space-y-3">
          <SectionHeader
            title={label}
            actionLabel={category === 'gamification' ? 'probar caja' : undefined}
            onAction={category === 'gamification' ? () => openModal('mysteryBox') : undefined}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const Icon = iconMap[item.icon];
                const disabled = Boolean(item.disabledReason) || (player?.coins ?? 0) < item.cost;
                const modal = item.icon === 'box' ? 'mysteryBox' : item.icon === 'zap' ? 'levelUp' : 'purchase';
                return (
                  <Card key={item.id} className={disabled ? 'opacity-60' : undefined}>
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-bg-tertiary text-coins">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
                          <Badge>{item.stockLabel}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-md font-semibold text-coins">{formatNumber(item.cost)}</span>
                          <Button
                            size="sm"
                            variant={disabled ? 'secondary' : 'primary'}
                            disabled={disabled}
                            onClick={() => openModal(modal)}
                          >
                            {disabled ? item.disabledReason ?? 'saldo insuficiente' : 'canjear'}
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
