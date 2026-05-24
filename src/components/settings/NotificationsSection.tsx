import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

import { useToast } from '../../hooks/useToast';
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushSubscriptionState,
  pushEnableErrorMessage,
  resolveVapidPublicKey,
} from '../../pushSubscription';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';
import { getPushUnavailableReason, PUSH_UNAVAILABLE_COPY } from '../../lib/pushSupport';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function NotificationsSection() {
  const toast = useToast();
  const authReady = useAuthStore((s) => s.status === 'ready');
  const branding = useBrandingStore((s) => s.config);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const unavailable = getPushUnavailableReason();
  const vapidKey = resolveVapidPublicKey(
    branding?.vapid_public_key,
    import.meta.env.VITE_VAPID_PUBLIC_KEY,
  );

  useEffect(() => {
    if (!authReady || unavailable) {
      setSubscribed(null);
      return;
    }
    let cancelled = false;
    void getPushSubscriptionState().then((state) => {
      if (!cancelled) setSubscribed(state.subscribed);
    });
    return () => {
      cancelled = true;
    };
  }, [authReady, unavailable]);

  if (!authReady) return null;

  if (unavailable === 'browser_not_supported') return null;

  if (unavailable === 'permission_denied') return null;

  if (unavailable === 'ios_requires_pwa') {
    return (
      <Card className="space-y-2">
        <h2 className="text-md font-semibold text-text-primary">notificaciones push</h2>
        <p className="text-sm text-text-secondary">{PUSH_UNAVAILABLE_COPY.ios_requires_pwa}</p>
      </Card>
    );
  }

  const onEnable = async () => {
    if (!vapidKey) {
      toast.danger(pushEnableErrorMessage('missing_vapid_key'));
      return;
    }
    setLoading(true);
    try {
      const result = await enablePushNotifications(vapidKey);
      if (!result.ok) {
        toast.danger(pushEnableErrorMessage(result.reason));
        return;
      }
      setSubscribed(true);
      toast.success('Notificaciones push activadas');
    } finally {
      setLoading(false);
    }
  };

  const onDisable = async () => {
    setLoading(true);
    try {
      await disablePushNotifications();
      setSubscribed(false);
      toast.success('Notificaciones push desactivadas');
    } catch {
      toast.danger('No pudimos desactivar las notificaciones push');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        {subscribed ? <Bell className="mt-0.5 h-5 w-5 text-accent" /> : <BellOff className="mt-0.5 h-5 w-5 text-text-tertiary" />}
        <div className="min-w-0 flex-1">
          <h2 className="text-md font-semibold text-text-primary">notificaciones push</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Recibí avisos de misiones, premios y novedades aunque no tengas la pestaña abierta.
          </p>
        </div>
      </div>

      {subscribed === null ? (
        <p className="text-sm text-text-tertiary">Comprobando suscripción…</p>
      ) : subscribed ? (
        <Button variant="secondary" size="sm" isLoading={loading} onClick={() => void onDisable()}>
          Desactivar notificaciones
        </Button>
      ) : (
        <Button variant="primary" size="sm" isLoading={loading} disabled={!vapidKey} onClick={() => void onEnable()}>
          Activar notificaciones
        </Button>
      )}

      {!vapidKey ? (
        <p className="text-xs text-text-tertiary">Push no configurado para este operador (falta VAPID public key).</p>
      ) : null}
    </Card>
  );
}
