import { delay, http, HttpResponse } from 'msw';

import {
  mockMissions,
  mockNews,
  mockNotifications,
  mockPlayer,
  mockPosts,
  mockRanking,
  mockShopItems,
  mockTournaments,
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
];
