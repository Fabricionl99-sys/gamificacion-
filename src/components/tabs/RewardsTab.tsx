import { Box, Flame, Gift, RotateCw } from 'lucide-react';

import { getChestInventory } from '../../api/chests';
import { getWheelsInventory } from '../../api/wheels';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { useRewardsInventoryStore } from '../../store/rewardsInventoryStore';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';

export default function RewardsTab() {
  const openModal = useModalsStore((s) => s.openModal);
  const setSelectedChest = useRewardsInventoryStore((s) => s.setSelectedChest);
  const setSelectedWheel = useRewardsInventoryStore((s) => s.setSelectedWheel);
  const { data: chests = [], isLoading: chestsLoading } = useAsyncData(getChestInventory, []);
  const { data: wheels = [], isLoading: wheelsLoading } = useAsyncData(getWheelsInventory, []);

  const isLoading = chestsLoading || wheelsLoading;
  const isEmpty = !isLoading && chests.length === 0 && wheels.length === 0;

  const openChest = (chest: (typeof chests)[number]) => {
    setSelectedChest(chest);
    openModal('streakChest');
  };

  const openWheel = (wheel: (typeof wheels)[number]) => {
    setSelectedWheel(wheel);
    openModal('wheel');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Cofres y rueda" description="Cargando inventario..." />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="space-y-4">
        <SectionHeader
          title="Cofres y rueda"
          description="Premios con animación — el resultado lo define el servidor antes de abrir."
        />
        <EmptyState
          icon={<Box className="h-8 w-8" />}
          title="El operador no configuró cofres todavía"
          description="Cuando tengas cofres o giros de rueda en tu inventario los vas a ver acá."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Cofres y rueda"
        description="Premios con animación — el resultado lo define el servidor antes de abrir."
      />

      {chests.map((chest) => (
        <Card
          key={chest.id}
          variant="neon"
          className="cursor-pointer transition hover:-translate-y-0.5"
          onClick={() => openChest(chest)}
        >
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/15 text-accent">
              <Gift className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text-primary">{chest.name ?? chest.title ?? 'Cofre'}</p>
              {chest.description ? (
                <p className="mt-1 text-module-body text-text-secondary">{chest.description}</p>
              ) : null}
              <p className="mt-2 text-metadata font-medium text-accent">
                {chest.quantity != null && chest.quantity > 1 ? `${chest.quantity} disponibles · ` : ''}
                abrir
              </p>
            </div>
          </div>
        </Card>
      ))}

      {wheels.map((wheel) => (
        <Card
          key={wheel.id}
          variant="neon"
          className="cursor-pointer transition hover:-translate-y-0.5"
          onClick={() => openWheel(wheel)}
        >
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/15 text-accent">
              <RotateCw className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text-primary">{wheel.name ?? wheel.title ?? 'Rueda de la fortuna'}</p>
              {wheel.description ? (
                <p className="mt-1 text-module-body text-text-secondary">{wheel.description}</p>
              ) : null}
              <p className="mt-2 text-metadata font-medium text-accent">
                {wheel.cost_label ?? (wheel.spins_remaining != null ? `${wheel.spins_remaining} giros · girar` : 'girar')}
              </p>
            </div>
          </div>
        </Card>
      ))}

      <Card className="border-dashed border-border-default bg-bg-tertiary/50 p-3">
        <p className="flex items-center gap-2 text-module-body text-text-tertiary">
          <Flame className="h-3.5 w-3.5 shrink-0" />
          También podés canjear items desde la pestaña Tienda.
        </p>
      </Card>
    </div>
  );
}
