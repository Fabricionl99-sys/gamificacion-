export function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isIosStandalonePwa(): boolean {
  if (!isIosDevice()) return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

export function isPushApiSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export type PushUnavailableReason =
  | 'browser_not_supported'
  | 'ios_requires_pwa'
  | 'permission_denied';

export function getPushUnavailableReason(): PushUnavailableReason | null {
  if (!isPushApiSupported()) {
    if (isIosDevice() && !isIosStandalonePwa()) return 'ios_requires_pwa';
    return 'browser_not_supported';
  }
  if (Notification.permission === 'denied') return 'permission_denied';
  return null;
}

export const PUSH_UNAVAILABLE_COPY: Record<PushUnavailableReason, string> = {
  browser_not_supported: 'Tu navegador no soporta notificaciones push.',
  ios_requires_pwa: 'En iPhone o iPad, agregá el sitio a la pantalla de inicio para activar push.',
  permission_denied: 'Bloqueaste las notificaciones en el navegador.',
};
