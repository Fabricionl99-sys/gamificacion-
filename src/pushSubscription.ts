import { apiClient } from './api/client';

export type PushEnableResult =
  | { ok: true }
  | { ok: false; reason: string };

export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export async function getPushSubscriptionState(): Promise<{ subscribed: boolean }> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { subscribed: false };
  }
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return { subscribed: false };
  const subscription = await registration.pushManager.getSubscription();
  return { subscribed: Boolean(subscription) };
}

export async function enablePushNotifications(vapidPublicKey: string): Promise<PushEnableResult> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, reason: 'browser_not_supported' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: 'permission_denied' };
  }

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });

  const subJson = subscription.toJSON();
  if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
    return { ok: false, reason: 'invalid_subscription' };
  }

  try {
    await apiClient.post('/v1/player/push-tokens/subscribe', {
      endpoint: subJson.endpoint,
      keys: {
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
      },
      user_agent: navigator.userAgent,
    });
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    return { ok: false, reason: status ? `backend_${status}` : 'backend_error' };
  }

  return { ok: true };
}

export async function disablePushNotifications(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  try {
    await apiClient.delete('/v1/player/push-tokens/unsubscribe', {
      data: { endpoint: subscription.endpoint },
    });
  } catch {
    // Best effort: still unsubscribe locally so the browser stops receiving push.
  }

  await subscription.unsubscribe();
}

export function resolveVapidPublicKey(
  brandingKey?: string | null,
  envKey?: string | null,
): string | null {
  const key = (brandingKey ?? envKey ?? '').trim();
  return key.length > 0 ? key : null;
}

export const PUSH_ENABLE_ERROR_COPY: Record<string, string> = {
  browser_not_supported: 'Tu navegador no soporta notificaciones push.',
  permission_denied: 'Necesitamos permiso del navegador para enviarte avisos.',
  missing_vapid_key: 'Push no está configurado para este operador.',
  invalid_subscription: 'No pudimos crear la suscripción push.',
  backend_error: 'No pudimos registrar la suscripción en el servidor.',
};

export function pushEnableErrorMessage(reason: string): string {
  if (PUSH_ENABLE_ERROR_COPY[reason]) return PUSH_ENABLE_ERROR_COPY[reason];
  if (reason.startsWith('backend_')) return `Error del servidor (${reason.replace('backend_', '')})`;
  return 'No pudimos activar las notificaciones push.';
}
