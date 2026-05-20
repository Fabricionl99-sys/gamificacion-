import axios from 'axios';

import type { PublicBrandingConfig } from '../types/branding';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 12_000,
});

export async function fetchPublicBranding(tenantId: string): Promise<PublicBrandingConfig> {
  const res = await api.get<{ data: PublicBrandingConfig }>(`/v1/public/branding/${tenantId}`);
  return res.data.data;
}
