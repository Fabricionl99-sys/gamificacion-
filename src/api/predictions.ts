import { apiClient } from './client';
import type { PredictionEvent } from '../types/prediction';

export type PredictionStatusFilter = 'active' | 'my' | 'past';

export async function getPredictionEvents(status: PredictionStatusFilter = 'active') {
  return apiClient
    .get('/player/predictions/events', { params: { status } })
    .then((response) => response.data as PredictionEvent[]);
}

export async function getPredictionEvent(id: string) {
  return apiClient.get(`/player/predictions/events/${id}`).then((response) => response.data as PredictionEvent);
}

export async function submitPrediction(eventId: string, predictions: Record<string, string>) {
  return apiClient
    .post(`/player/predictions/events/${eventId}/predict`, { predictions })
    .then((response) => response.data as PredictionEvent);
}
