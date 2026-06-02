import { CheckCheck } from 'lucide-react';

import {
  useAutoMarkNotificationsOnPanelOpen,
  usePlayerNotificationsPanel,
} from '../../hooks/usePlayerNotifications';
import { useModalsStore } from '../../store/modalsStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { NotificationsEmptyState } from '../tabs/emptyStateCopy';
import { NotificationListItem } from '../notifications/NotificationListItem';
import type { PlayerInAppNotification } from '../../types/notifications';

export default function NotificationCenterModal() {
  const { activeModal, closeModal } = useModalsStore();
  const isOpen = activeModal === 'notifications';
  const { notifications, unreadCount, isLoading, error, refresh, markOpened, markAllSeen } =
    usePlayerNotificationsPanel();

  useAutoMarkNotificationsOnPanelOpen(isOpen);

  const handleOpenNotification = async (notification: PlayerInAppNotification) => {
    if (notification.cta_url) {
      window.open(notification.cta_url, '_blank', 'noopener,noreferrer');
    }
    if (!notification.opened) {
      await markOpened(notification.id);
    }
  };

  const handleMarkRead = async (notification: PlayerInAppNotification) => {
    if (!notification.opened) {
      await markOpened(notification.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={`Notificaciones${unreadCount > 0 ? ` · ${unreadCount} nuevas` : ''}`}
      description="Avisos del operador sobre premios, niveles y novedades."
      className="md:mr-8 md:mt-20 md:self-start"
    >
      {unreadCount > 0 ? (
        <div className="mb-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void markAllSeen()}
            leftIcon={<CheckCheck className="h-4 w-4" />}
          >
            Marcar todas como leídas
          </Button>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-center">
          <p className="text-sm font-semibold text-text-primary">No pudimos cargar tus notificaciones</p>
          <p className="mt-1 text-metadata text-text-secondary">{error.message}</p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={() => void refresh()}>
            Reintentar
          </Button>
        </div>
      ) : isLoading && notifications.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">Cargando notificaciones…</p>
      ) : notifications.length > 0 ? (
        <div aria-live="polite" className="max-h-[min(70vh,28rem)] space-y-2 overflow-y-auto pr-1">
          {notifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onOpen={(item) => void handleOpenNotification(item)}
              onMarkRead={(item) => void handleMarkRead(item)}
            />
          ))}
        </div>
      ) : (
        <NotificationsEmptyState />
      )}
    </Modal>
  );
}
