import { delay, http, HttpResponse } from 'msw';

import {
  mockMissions,
  mockNews,
  mockNotifications,
  mockPlayer,
  mockPredictionEvents,
  mockPredictionMarkets,
  mockPlayerRankings,
  mockLeaderboards,
  mockShopItems,
  mockTournaments,
  mockActiveBoosts,
} from '../index';
import { feedState } from '../feedState';
import type { FeedScope } from '../../types/social';

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
  http.get('*/player/rankings', async () => {
    await wait();
    return HttpResponse.json(mockPlayerRankings);
  }),
  http.get('*/player/rankings/:id/leaderboard', async ({ params }) => {
    await wait();
    return HttpResponse.json(mockLeaderboards[String(params.id)] ?? mockLeaderboards.best_xp);
  }),
  http.get('*/player/ranking', async () => {
    await wait();
    return HttpResponse.json(mockPlayerRankings);
  }),
  http.get('*/player/tournaments', async () => {
    await wait();
    return HttpResponse.json(mockTournaments);
  }),
  http.get('*/player/feed', async ({ request }) => {
    await wait();
    const scope = (new URL(request.url).searchParams.get('scope') ?? 'following') as FeedScope;
    return HttpResponse.json(feedState.list(scope));
  }),
  http.get('*/player/feed/shareable-picks', async () => {
    await wait();
    return HttpResponse.json(feedState.getShareablePicks());
  }),
  http.post('*/player/feed/posts', async ({ request }) => {
    await wait();
    try {
      const body = (await request.json()) as { body: string; sharePickId?: string };
      return HttpResponse.json(feedState.createPost(body));
    } catch (error) {
      if (error instanceof Error && error.message === 'PROFILE_PRIVATE') {
        return HttpResponse.json({ code: 'PROFILE_PRIVATE', message: 'Perfil privado' }, { status: 403 });
      }
      return HttpResponse.json({ code: 'UNKNOWN', message: 'No se pudo publicar' }, { status: 400 });
    }
  }),
  http.post('*/player/feed/posts/:postId/like', async ({ params }) => {
    await wait();
    try {
      return HttpResponse.json(feedState.toggleLike(String(params.postId)));
    } catch {
      return HttpResponse.json({ code: 'POST_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.get('*/player/feed/posts/:postId/comments', async ({ params }) => {
    await wait();
    return HttpResponse.json(feedState.getComments(String(params.postId)));
  }),
  http.post('*/player/feed/posts/:postId/comments', async ({ params, request }) => {
    await wait();
    const body = (await request.json()) as { body: string };
    try {
      return HttpResponse.json(feedState.addComment(String(params.postId), body.body));
    } catch {
      return HttpResponse.json({ code: 'POST_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.post('*/player/feed/posts/:postId/copy-pick', async ({ params, request }) => {
    await wait();
    const body = (await request.json()) as { pickId: string };
    try {
      return HttpResponse.json(feedState.copyPick(String(params.postId), body.pickId));
    } catch {
      return HttpResponse.json({ code: 'PICK_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.get('*/player/feed-posts', async ({ request }) => {
    await wait();
    const scope = (new URL(request.url).searchParams.get('scope') ?? 'following') as FeedScope;
    return HttpResponse.json(feedState.list(scope));
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
