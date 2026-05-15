import { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import { getPlayer } from '../../api/player';
import { getShopItems } from '../../api/shop';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../hooks/useToast';
import type { Player } from '../../types/player';
import { useModalsStore } from '../../store/modalsStore';
import { useShopStore } from '../../store/shopStore';
import type { ShopCategory, ShopItem } from '../../types/reward';
import { formatNumber } from '../../utils/format';
import { ShopProductCard } from '../shop/ShopProductCard';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import { tabEmptyStates } from './emptyStateConfig';

type ShopFilter = 'all' | ShopCategory;

const categoryTabs: { id: ShopFilter; label: string }[] = [
  { id: 'all', label: 'todos' },
  { id: 'operatorBonus', label: 'bonos' },
  { id: 'gamification', label: 'gamificación' },
  { id: 'physical', label: 'físicos' },
];

const isExpired = (item: ShopItem) => Boolean(item.endsAt && new Date(item.endsAt).getTime() <= Date.now());

function WalletBalances({ player }: { player?: Player }) {
  if (player?.wallet?.length) {
    return (
      <div className="flex flex-wrap gap-2">
        {player.wallet.map((currency) => (
          <div key={currency.id} className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-tertiary px-3 py-2">
            {currency.imageUrl ? <img src={currency.imageUrl} alt="" className="h-6 w-6 rounded-full object-cover" /> : null}
            <div>
              <p className="text-[10px] uppercase tracking-wide text-text-tertiary">{currency.name}</p>
              <p className="text-sm font-semibold text-coins">{formatNumber(currency.balance)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <span className="text-xl font-semibold tracking-tight text-coins">{formatNumber(player?.coins ?? 0)} monedas</span>;
}

export default function ShopTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const setSelectedItem = useShopStore((state) => state.setSelectedItem);
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('all');
  const { data: player } = useAsyncData(getPlayer);
  const { data: shopItems, isLoading, error } = useAsyncData(getShopItems, []);

  const allItems = useMemo(
    () => [...(shopItems ?? [])].filter((item) => !isExpired(item)).sort((a, b) => Number(b.featured) - Number(a.featured)),
    [shopItems],
  );

  const items = useMemo(() => {
    if (activeFilter === 'all') return allItems;
    return allItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, allItems]);

  const openDetail = (item: ShopItem) => {
    setSelectedItem(item);
    openModal('shopDetail');
  };

  const openRedeem = (item: ShopItem) => {
    setSelectedItem(item);
    if (item.icon === 'box') {
      openModal('mysteryBox');
      return;
    }
    openModal('purchase');
  };

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) {
    return (
      <EmptyState icon={<ShoppingBag className="h-8 w-8" />} title="No pudimos cargar la tienda" description="Intentá de nuevo en unos minutos." />
    );
  }

  if (allItems.length === 0) {
    return <EmptyState icon={tabEmptyStates.shop.icon} title={tabEmptyStates.shop.title} description={tabEmptyStates.shop.description} />;
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">tu saldo</p>
        <WalletBalances player={player} />
      </Card>

      <Tabs
        tabs={categoryTabs.map((tab) => ({
          ...tab,
          count:
            tab.id === 'all'
              ? allItems.length
              : allItems.filter((item) => item.category === tab.id).length,
        }))}
        activeTab={activeFilter}
        onChange={(tabId) => setActiveFilter(tabId as ShopFilter)}
        ariaLabel="Categorías de la tienda"
      />

      <div className="grid gap-3">
        {items.map((item) => (
          <ShopProductCard
            key={item.id}
            item={item}
            player={player}
            onDetail={openDetail}
            onRedeem={openRedeem}
            onNotify={() => toast.info('Te avisaremos cuando vuelva el stock')}
            onVipInfo={(entry) => toast.info(`Necesitás VIP ${entry.vipRequired} o superior para canjear este ítem`)}
          />
        ))}
      </div>
    </div>
  );
}
