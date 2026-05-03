import { AlertTriangle, Bell, Box, Flame, Gift, Loader, RotateCw, Sparkles, Ticket, Trophy } from 'lucide-react';

import { useModalsStore } from '../store/modalsStore';
import { useUiStore } from '../store/uiStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import MysteryBoxModal from '../components/modals/MysteryBoxModal';
import WheelModal from '../components/modals/WheelModal';
import StreakChestModal from '../components/modals/StreakChestModal';
import ScratchCardModal from '../components/modals/ScratchCardModal';
import LevelUpModal from '../components/modals/LevelUpModal';

const modalButtons = [
  { label: 'caja misteriosa', modal: 'mysteryBox', icon: Box },
  { label: 'rueda fortuna', modal: 'wheel', icon: RotateCw },
  { label: 'cofre racha', modal: 'streakChest', icon: Gift },
  { label: 'raspadita', modal: 'scratchCard', icon: Ticket },
  { label: 'level up', modal: 'levelUp', icon: Sparkles },
] as const;

const stateButtons = [
  { label: 'loading', icon: Loader },
  { label: 'empty', icon: Box },
  { label: 'error', icon: AlertTriangle },
  { label: 'disabled', icon: Bell },
  { label: 'racha rota', icon: Flame },
  { label: 'premios pendientes', icon: Gift },
  { label: 'sin notificaciones', icon: Bell },
] as const;

export default function DemoPage() {
  const { openModal, activeModal, closeModal } = useModalsStore();
  const setActiveView = useUiStore((state) => state.setActiveView);

  return (
    <main className="min-h-dvh bg-bg-primary p-4 text-text-primary md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="card-glass rounded-xl p-5">
          <Badge variant="success">demo interna</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Widget gamificacion iGaming</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Laboratorio para revisar modales de recompensa y estados especiales sin depender del backend.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => setActiveView('widget')}>
            volver al widget
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Modales de recompensa</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {modalButtons.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.modal} variant="primary" onClick={() => openModal(item.modal)} leftIcon={<Icon className="h-4 w-4" />}>
                    abrir {item.label}
                  </Button>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Forzar estados</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {stateButtons.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.label} variant="secondary" leftIcon={<Icon className="h-4 w-4" />}>
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-3">
            <h3 className="font-semibold">loading</h3>
            <Skeleton className="h-24" />
            <Skeleton className="h-12" />
          </Card>
          <Card>
            <EmptyState
              icon={<Trophy className="h-8 w-8" />}
              title="tu primera semana en el ranking"
              description="competi por XP para subir"
            />
          </Card>
          <Card className="space-y-3 opacity-60">
            <h3 className="font-semibold">disabled</h3>
            <ProgressBar value={35} ariaLabel="estado disabled de ejemplo" />
            <Button disabled className="w-full" variant="primary">
              requiere VIP plata
            </Button>
          </Card>
        </section>
      </div>

      <MysteryBoxModal />
      <WheelModal />
      <StreakChestModal />
      <ScratchCardModal />
      <LevelUpModal />
      <Modal isOpen={activeModal === 'notifications'} onClose={closeModal} title="demo">
        <p className="text-sm text-text-secondary">modal generico demo</p>
      </Modal>
    </main>
  );
}
