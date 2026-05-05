import { delay, http, HttpResponse } from 'msw';

import {
  mockAchievements,
  mockMissions,
  mockNews,
  mockNotifications,
  mockPlayer,
  mockPredictionEvents,
  mockPredictionMarkets,
  mockPosts,
  mockRanking,
  mockShopItems,
  mockTournaments,
  mockActiveBoosts,
} from '../index';

const wait = () => delay(180 + Math.random() * 320);

export const handlers = [
  http.get('*/player/me', async () => {
    await wait();
    return HttpResponse.json(mockPlayer);
  }),
  http.get('*/player/missions', async () => {
    await wait();
    return HttpResponse.json(mockMissions);
  }),
  http.get('*/player/shop-products', async () => {
    await wait();
    return HttpResponse.json(mockShopItems);
  }),
  http.get('*/player/ranking', async () => {
    await wait();
    return HttpResponse.json(mockRanking);
  }),
  http.get('*/player/tournaments', async () => {
    await wait();
    return HttpResponse.json(mockTournaments);
  }),
  http.get('*/player/feed', async () => {
    await wait();
    return HttpResponse.json(mockPosts);
  }),
  http.get('*/player/feed-posts', async () => {
    await wait();
    return HttpResponse.json(mockPosts);
  }),
  http.get('*/player/news', async () => {
    await wait();
    return HttpResponse.json(mockNews);
  }),
  http.get('*/player/notifications', async () => {
    await wait();
    return HttpResponse.json(mockNotifications);
  }),
  http.get('*/player/active-boosts', async () => {
    await wait();
    return HttpResponse.json(mockActiveBoosts);
  }),
  http.get('*/player/achievements', async () => {
    await wait();
    return HttpResponse.json(mockAchievements);
  }),
  http.get('*/player/predictions/events', async ({ request }) => {
    await wait();
    const status = new URL(request.url).searchParams.get('status') ?? 'active';
    return HttpResponse.json(
      mockPredictionEvents.filter((event) =>
        status === 'all'
          ? true
          : status === 'my'
            ? event.items.some((item) => item.player_prediction)
            : event.status === status,
      ),
    );
  }),
  http.get('*/player/predictions/events/:id', async ({ params }) => {
    await wait();
    return HttpResponse.json(mockPredictionEvents.find((event) => event.id === params.id) ?? mockPredictionEvents[0]);
  }),
  http.post('*/player/predictions/events/:id/predict', async ({ params, request }) => {
    await wait();
    const body = await request.json() as { predictions: Record<string, string> };
    const event = mockPredictionEvents.find((entry) => entry.id === params.id) ?? mockPredictionEvents[0];
    event.items = event.items.map((item) => ({ ...item, player_prediction: body.predictions[item.id] ?? item.player_prediction }));
    return HttpResponse.json({ ok: true, event });
  }),
  http.get('*/player/predictions/markets', async () => {
    await wait();
    return HttpResponse.json(mockPredictionMarkets);
  }),
];
