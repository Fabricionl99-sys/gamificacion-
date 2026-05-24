function mockServiceWorkerUrl(registration: ServiceWorkerRegistration): string | undefined {
  return (
    registration.active?.scriptURL ??
    registration.waiting?.scriptURL ??
    registration.installing?.scriptURL
  );
}

export function isMockServiceWorkerRegistration(registration: ServiceWorkerRegistration): boolean {
  const scriptUrl = mockServiceWorkerUrl(registration);
  return Boolean(scriptUrl?.includes('mockServiceWorker.js'));
}

/** MSW deja mockServiceWorker.js registrado; no tocar /service-worker.js de push. */
export async function unregisterMockServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.filter(isMockServiceWorkerRegistration).map((registration) => registration.unregister()),
  );
}
