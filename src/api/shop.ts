import { apiClient } from './client';
import type { ShopItem } from '../types/reward';

export const getShopItems = async () => apiClient.get<ShopItem[]>('/player/shop-products').then((response) => response.data);
