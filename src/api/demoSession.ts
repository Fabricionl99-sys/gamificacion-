import { apiClient } from './client';
import { unwrapData } from '../lib/apiResponse';
import { normalizeDemoSession, type DemoSession } from '../lib/normalizeDemoSession';

export type { DemoSession };

export interface CreateDemoSessionInput {
  tenant_id: string;
  existing_player_id?: string | null;
  currency_code?: string | null;
}

function buildDemoSessionBody(input: CreateDemoSessionInput): Record<string, string> {
  const body: Record<string, string> = { tenant_id: input.tenant_id };
  if (input.existing_player_id?.trim()) {
    body.existing_player_id = input.existing_player_id.trim();
  }
  const currency = input.currency_code?.trim().toUpperCase();
  if (currency) body.currency_code = currency;
  return body;
}

export async function createDemoSession(input: CreateDemoSessionInput): Promise<DemoSession> {
  const { data } = await apiClient.post<unknown>(
    '/v1/public/demo/session',
    buildDemoSessionBody(input),
  );
  return normalizeDemoSession(unwrapData<Record<string, unknown>>(data));
}

/** Mint a fresh demo player (td reset → external_player_id + jwt). */
export async function resetDemoSession(input: Pick<CreateDemoSessionInput, 'tenant_id' | 'currency_code'>): Promise<DemoSession> {
  const body: Record<string, string> = { tenant_id: input.tenant_id };
  const currency = input.currency_code?.trim().toUpperCase();
  if (currency) body.currency_code = currency;
  const { data } = await apiClient.post<unknown>('/v1/public/demo/session/reset', body);
  return normalizeDemoSession(unwrapData<Record<string, unknown>>(data));
}
