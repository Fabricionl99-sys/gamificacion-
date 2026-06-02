import { Bell, Check } from 'lucide-react';

import type { PlayerInAppNotification } from '../../types/notifications';
import { safeFormatRelativeTime } from '../../utils/date';
import { cn } from '../../utils/classnames';

function NotificationIcon({ icon }: { icon: string | null }) {
  if (icon?.startsWith('http')) {
    return <img alt="" className="h-5 w-5 object-contain" src={icon} />;
  }
  if (icon) {
    return <span className="text-base leading-none">{icon}</span>;
  }
  return <Bell className="h-4 w-4 text-text-secondary" aria-hidden />;
}

export function NotificationListItem({
  notification,
  onOpen,
  onMarkRead,
}: {
  notification: PlayerInAppNotification;
  onOpen: (notification: PlayerInAppNotification) => void;
  onMarkRead: (notification: PlayerInAppNotification) => void;
}) {
  const unread = !notification.opened;

  return (
    <article
      className={cn(
        'relative flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all duration-300',
        unread
          ? 'border border-accent/25 border-l-[3px] border-l-accent bg-bg-secondary'
          : 'border border-transparent bg-bg-primary/30 opacity-70',
      )}
    >
      {unread ? (
        <span
          className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-300"
          aria-hidden
        />
      ) : null}

      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={() => onOpen(notification)}
      >
        <span
          className={cn(
            'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300',
            unread ? 'bg-accent/15' : 'bg-bg-tertiary',
          )}
        >
          <NotificationIcon icon={notification.icon} />
        </span>
        <span className="min-w-0 flex-1 pr-1">
          <span
            className={cn(
              'block text-sm transition-all duration-300',
              unread ? 'font-bold text-text-primary' : 'font-medium text-text-secondary',
            )}
          >
            {notification.title}
          </span>
          <span
            className={cn(
              'mt-0.5 block text-sm transition-colors duration-300',
              unread ? 'text-text-primary/90' : 'text-text-tertiary',
            )}
          >
            {notification.body}
          </span>
          <span className="mt-1 block text-metadata text-text-tertiary">
            {safeFormatRelativeTime(notification.created_at)}
          </span>
          {notification.cta_label ? (
            <span className="mt-1 inline-block text-metadata font-semibold text-accent">{notification.cta_label}</span>
          ) : null}
        </span>
        {notification.image_url ? (
          <img
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
            src={notification.image_url}
          />
        ) : null}
      </button>

      {unread ? (
        <button
          type="button"
          className="shrink-0 rounded-lg border border-border-default px-2 py-1 text-[11px] font-semibold text-text-secondary transition hover:border-accent/40 hover:bg-bg-tertiary hover:text-text-primary"
          onClick={() => onMarkRead(notification)}
        >
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" aria-hidden />
            Marcar como leído
          </span>
        </button>
      ) : null}
    </article>
  );
}
