import axios from 'axios';

import { getStoredDemoAccessToken } from '../lib/demoSessionStorage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredDemoAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
