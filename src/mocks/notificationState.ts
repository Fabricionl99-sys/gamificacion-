import { subHours } from 'date-fns';

import type { PlayerInAppNotification } from '../types/notifications';

const now = new Date();

function seedNotifications(): PlayerInAppNotification[] {
  return [
    {
      id: 'notif-001',
      trigger_event: 'manual',
      title: '¡Tenés un nuevo premio!',
      body: 'Te entregamos un avatar de regalo. Revisá tu colección.',
      icon: '🎁',
      cta_label: 'Ver avatares',
      cta_url: null,
      image_url: null,
      created_at: subHours(now, 1).toISOString(),
      opened: false,
    },
    {
      id: 'notif-002',
      trigger_event: 'level_up',
      title: 'Subiste de nivel',
      body: 'Alcanzaste el nivel 5. Reclamá tu recompensa.',
      icon: '⭐',
      cta_label: null,
      cta_url: null,
      image_url: null,
      created_at: subHours(now, 4).toISOString(),
      opened: false,
    },
    {
      id: 'notif-003',
      trigger_event: 'chest_received',
      title: 'Cofre recibido',
      body: 'Tenés un cofre nuevo en tu inventario.',
      icon: null,
      cta_label: 'Abrir cofre',
      cta_url: null,
      image_url: null,
      created_at: subHours(now, 27).toISOString(),
      opened: true,
    },
  ];
}

let notifications = seedNotifications();

export const notificationState = {
  list: (): PlayerInAppNotification[] => [...notifications],
  open: (id: string) => {
    notifications = notifications.map((row) => (row.id === id ? { ...row, opened: true } : row));
  },
  bulkSeen: (ids: string[]) => {
    const idSet = new Set(ids);
    notifications = notifications.map((row) => (idSet.has(row.id) ? { ...row, opened: true } : row));
  },
  reset: () => {
    notifications = seedNotifications();
  },
};

/** @deprecated use notificationState.list() */
export const mockNotifications = notificationState.list();
