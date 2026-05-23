import { Box, Flame, Gift, RotateCw } from 'lucide-react';

import { mockShopItems } from '../../mocks/index';
import { useModalsStore } from '../../store/modalsStore';
import { useShopStore } from '../../store/shopStore';
import { Card } from '../ui/Card';
import { SectionHeader } from '../shared/SectionHeader';

const mysteryBoxItem = mockShopItems.find((i) => i.icon === 'box') ?? mockShopItems[0]!;

export default function RewardsTab() {
  const openModal = useModalsStore((s) => s.openModal);
  const setSelectedItem = useShopStore((s) => s.setSelectedItem);

  const openMysteryBox = () => {
    setSelectedItem(mysteryBoxItem);
    openModal('mysteryBox');
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Cofres y rueda"
        description="Premios con animación — el resultado lo define el servidor antes de abrir."
      />

      <Card
        variant="neon"
        className="cursor-pointer transition hover:-translate-y-0.5"
        onClick={openMysteryBox}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/15 text-accent">
            <Box className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-text-primary">Caja misteriosa</p>
            <p className="mt-1 text-module-body text-text-secondary">
              Estilo CS: pasa todos los premios y frena en el resultado.
            </p>
            <p className="mt-2 text-metadata font-medium text-accent">{mysteryBoxItem.cost} monedas · abrir</p>
          </div>
        </div>
      </Card>

      <Card
        className="cursor-pointer transition hover:-translate-y-0.5"
        onClick={() => openModal('streakChest')}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-warning/15 text-warning">
            <Gift className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-text-primary">Cofre de racha</p>
            <p className="mt-1 text-module-body text-text-secondary">
              Cofre clásico: vibración, apertura de tapa y premio.
            </p>
            <p className="mt-2 text-metadata font-medium text-warning">Disponible · abrir</p>
          </div>
        </div>
      </Card>

      <Card
        variant="neon"
        className="cursor-pointer transition hover:-translate-y-0.5"
        onClick={() => openModal('wheel')}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/15 text-accent">
            <RotateCw className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-text-primary">Rueda de la fortuna</p>
            <p className="mt-1 text-module-body text-text-secondary">
              Giro largo con desaceleración realista — sin freno brusco.
            </p>
            <p className="mt-2 text-metadata font-medium text-accent">100 XP · girar</p>
          </div>
        </div>
      </Card>

      <Card className="border-dashed border-border-default bg-bg-tertiary/50 p-3">
        <p className="flex items-center gap-2 text-module-body text-text-tertiary">
          <Flame className="h-3.5 w-3.5 shrink-0" />
          También podés canjear cajas desde la pestaña Tienda.
        </p>
      </Card>
    </div>
  );
}
