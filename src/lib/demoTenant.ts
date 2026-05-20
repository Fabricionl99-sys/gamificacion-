const DEFAULT_TENANT = 'social2game';

/** `?tenant=` desde el BO («Ver mi demo»). */
export function getTenantIdFromUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT;
  return new URLSearchParams(window.location.search).get('tenant')?.trim() || DEFAULT_TENANT;
}

export function isDefaultTenant(tenantId: string): boolean {
  return tenantId === DEFAULT_TENANT || tenantId === 'tenant-demo';
}
