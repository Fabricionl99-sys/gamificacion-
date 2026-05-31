import type { AxiosRequestConfig } from 'axios';

import { unwrapData } from '../lib/apiResponse';
import { apiClient } from './client';

export async function getJson<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<unknown>(path, config);
  return unwrapData<T>(data);
}

export async function postJson<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.post<unknown>(path, body, config);
  return unwrapData<T>(data);
}
