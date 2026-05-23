import { Gift } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getMyRaffleWins, getRaffles } from '../../api/raffles';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { getTenantIdFromUrl } from '../../lib/demoTenant';
import type { Raffle } from '../../types/raffle';
import { RaffleCard } from '../shared/RaffleCard';
import { SectionHeader } from '../shared/SectionHeader';
import { RaffleDetailModal } from '../modals/RaffleDetailModal';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';

type SubTab = 'open' | 'wins';

export default function RafflesTab() {
  const [subTab, setSubTab] = useState<SubTab>('open');
  const [selected, setSelected] = useState<Raffle | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { route, openDetail, closeDetail } = useWidgetNavigation();

  const { data: raffles = [], isLoading, error } = useAsyncData(getRaffles, [], [refreshKey]);
  const { data: wins = [], isLoading: winsLoading } = useAsyncData(getMyRaffleWins, [], [refreshKey, subTab]);

  const tenantId = getTenantIdFromUrl();
  const detailCode = route.tab === 'raffles' ? route.detailId : undefined;

  useEffect(() => {
    if (!detailCode) {
      setSelected(null);
      return;
    }
    const found = raffles.find((r) => r.code === detailCode);
    if (found) {
      setSelected(found);
      return;
    }
    if (!isLoading && raffles.length >= 0) {
      closeDetail('raffles');
    }
  }, [detailCode, raffles, isLoading, closeDetail]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Sorteos" description="Participá con gemas · sorteos verificables" />

      <Tabs
        tabs={[
          { id: 'open', label: 'Abiertos' },
          { id: 'wins', label: 'Mis premios' },
        ]}
        activeTab={subTab}
        onChange={(id) => setSubTab(id as SubTab)}
        ariaLabel="Sorteos"
      />

      {subTab === 'open' ? (
        <>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          ) : null}
          {error ? <p className="text-sm text-danger">No pudimos cargar sorteos</p> : null}
          {!isLoading && raffles.length === 0 ? (
            <EmptyState icon={<Gift className="h-8 w-8" />} title="Sin sorteos abiertos" description="Volvé pronto — el operador publicará nuevos sorteos." />
          ) : null}
          <div className="space-y-3">
            {raffles.map((r) => (
              <RaffleCard key={r.id} raffle={r} onOpen={() => openDetail('sorteos', r.code)} />
            ))}
          </div>
        </>
      ) : (
        <>
          {winsLoading ? <Skeleton className="h-24" /> : null}
          {!winsLoading && wins.length === 0 ? (
            <EmptyState icon={<Gift className="h-8 w-8" />} title="Sin premios aún" description="Cuando ganes un sorteo, aparecerá acá." />
          ) : null}
          <div className="space-y-3">
            {wins.map((w) => (
              <Card key={w.id} className="p-4">
                <p className="font-semibold text-text-primary">{w.raffleName}</p>
                <p className="mt-1 text-sm text-text-secondary">Ganaste posición #{w.position} · {w.prizeLabel}</p>
                <p className="mt-2 text-module-body text-text-tertiary">
                  {w.prizeType === 'bonus'
                    ? 'Bono acreditado en tu cuenta'
                    : w.physicalDeliveredAt
                      ? 'Premio físico entregado'
                      : 'Te vamos a contactar en 48 hs'}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      <RaffleDetailModal
        raffle={selected}
        tenantId={tenantId}
        autoFocusBuy={route.action === 'buy'}
        onClose={() => closeDetail('raffles')}
        onEntered={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
