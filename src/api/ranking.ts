import { apiClient } from './client';
import type { PublicPlayer } from '../types/player';

export const getRanking = async () => apiClient.get<PublicPlayer[]>('/player/ranking').then((response) => response.data);
