const LEGACY_DEFAULT = 'social2game';

/** Tenant demo en prod (`VITE_DEMO_TENANT_ID`) o `?tenant=` desde el BO. */
export function getTenantIdFromUrl(): string {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_DEMO_TENANT_ID?.trim() || LEGACY_DEFAULT;
  }
  const fromQuery = new URLSearchParams(window.location.search).get('tenant')?.trim();
  if (fromQuery) return fromQuery;
  return import.meta.env.VITE_DEMO_TENANT_ID?.trim() || LEGACY_DEFAULT;
}

export function isDefaultTenant(tenantId: string): boolean {
  const demoTenant = import.meta.env.VITE_DEMO_TENANT_ID?.trim();
  if (demoTenant && tenantId === demoTenant) return true;
  return tenantId === LEGACY_DEFAULT || tenantId === 'tenant-demo';
}
