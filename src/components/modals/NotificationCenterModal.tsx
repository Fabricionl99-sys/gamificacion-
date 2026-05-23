import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, CheckCheck } from 'lucide-react';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { fetchNotifications } from '../../api/notifications';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { useNotificationsStore } from '../../store/notificationsStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { NotificationsEmptyState } from '../tabs/emptyStateCopy';

export default function NotificationCenterModal() {
  const { activeModal, closeModal } = useModalsStore();
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const { data: notifications = [] } = useAsyncData(fetchNotifications, []);
  const { boosts } = useActiveBoosts();
  const boostNotifications = boosts.flatMap((boost) => [
    {
      id: `boost-start-${boost.rule_id}`,
      kind: 'system_event' as const,
      title: `🚀 ¡XP x${boost.multiplier} activado!`,
      detail: `vence ${formatDistanceToNow(new Date(boost.ends_at), { addSuffix: true, locale: es })}`,
      createdAt: boost.starts_at,
      read: false,
    },
    {
      id: `boost-end-${boost.rule_id}`,
      kind: 'system_event' as const,
      title: `Se terminó el x${boost.multiplier}`,
      detail: 'tu XP volvió al ritmo normal · ¡seguí ganando!',
      createdAt: boost.ends_at,
      read: true,
    },
  ]);
  const allNotifications = [...boostNotifications, ...notifications];
  const unreadCount = allNotifications.filter((item) => !item.read).length;

  return (
    <Modal
      isOpen={activeModal === 'notifications'}
      onClose={closeModal}
      title={`notificaciones · ${unreadCount} nuevas`}
      description="Se borran a los 7 dias salvo eventos criticos."
      className="md:mr-8 md:mt-20 md:self-start"
    >
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={markAllRead} leftIcon={<CheckCheck className="h-4 w-4" />}>
          marcar leidas
        </Button>
      </div>
      {allNotifications.length > 0 ? (
        <div aria-live="polite" className="space-y-5">
          {['HOY', 'AYER', 'esta semana · 4 mas'].map((section, sectionIndex) => (
            <section key={section}>
              <p className="mb-2 text-metadata font-semibold uppercase tracking-widest text-text-tertiary">{section}</p>
              <div className="space-y-2">
                {allNotifications.slice(sectionIndex, sectionIndex + 2).map((notification) => (
                  <button
                    key={`${section}-${notification.id}`}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg bg-bg-secondary p-3 text-left transition-colors hover:bg-bg-tertiary"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-bg-tertiary">
                      <Bell className="h-4 w-4 text-text-secondary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text-primary">{notification.title}</span>
                      <span className="block text-metadata text-text-secondary">{notification.detail}</span>
                      <span className="text-metadata text-text-tertiary">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                      </span>
                    </span>
                    {!notification.read ? <span className="h-2 w-2 rounded-full bg-accent" aria-label="no leida" /> : null}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <NotificationsEmptyState />
      )}
    </Modal>
  );
}
