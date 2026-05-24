import { delay, http, HttpResponse } from 'msw';

import { resolveBrandingSample } from '../data/brandingSamples';
import {
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
import { missionState } from '../missionState';
import type { CreatePostInput, FeedScope } from '../../types/social';

const wait = () => delay(180 + Math.random() * 320);

export const handlers = [
  http.post('*/v1/public/demo/session', async ({ request }) => {
    await wait();
    const body = (await request.json().catch(() => ({}))) as { existing_player_id?: string };
    const playerId = body.existing_player_id ?? `demo_${crypto.randomUUID().slice(0, 8)}`;
    return HttpResponse.json({
      data: {
        access_token: `mock_${playerId}`,
        player_id: playerId,
        tenant_id: '6b67e761-b833-402b-8d59-81c478ac782b',
      },
    });
  }),

  http.post('*/v1/public/demo/session/reset', async () => {
    await wait();
    return HttpResponse.json({ data: { ok: true } });
  }),

  http.get('*/v1/public/branding/:tenantId', async ({ params }) => {
    await wait();
    const tenantId = String(params.tenantId);
    return HttpResponse.json({ data: resolveBrandingSample(tenantId) });
  }),

  http.get('*/v1/player/me', async () => {
    await wait();
    return HttpResponse.json(mockPlayer);
  }),
  http.get('*/v1/player/missions', async () => {
    await wait();
    return HttpResponse.json(missionState.list());
  }),
  http.post('*/v1/player/missions/:id/claim', async ({ params }) => {
    await wait();
    try {
      return HttpResponse.json(missionState.claim(String(params.id)));
    } catch (error) {
      if (error instanceof Error && error.message === 'MISSION_NOT_FOUND') {
        return HttpResponse.json({ code: 'MISSION_NOT_FOUND' }, { status: 404 });
      }
      if (error instanceof Error && error.message === 'MISSION_NOT_CLAIMABLE') {
        return HttpResponse.json({ code: 'MISSION_NOT_CLAIMABLE' }, { status: 409 });
      }
      return HttpResponse.json({ code: 'UNKNOWN' }, { status: 400 });
    }
  }),
  http.get('*/v1/player/shop-products', async () => {
    await wait();
    return HttpResponse.json(mockShopItems);
  }),
  http.get('*/v1/player/rankings', async () => {
    await wait();
    return HttpResponse.json(mockPlayerRankings);
  }),
  http.get('*/v1/player/rankings/:id/leaderboard', async ({ params }) => {
    await wait();
    return HttpResponse.json(mockLeaderboards[String(params.id)] ?? mockLeaderboards.best_xp);
  }),
  http.get('*/v1/player/ranking', async () => {
    await wait();
    return HttpResponse.json(mockPlayerRankings);
  }),
  http.get('*/v1/player/tournaments', async () => {
    await wait();
    return HttpResponse.json(mockTournaments);
  }),
  http.get('*/v1/player/feed', async ({ request }) => {
    await wait();
    const scope = (new URL(request.url).searchParams.get('scope') ?? 'following') as FeedScope;
    return HttpResponse.json(feedState.list(scope));
  }),
  http.get('*/v1/player/feed/shareable-picks', async () => {
    await wait();
    return HttpResponse.json(feedState.getShareablePicks());
  }),
  http.post('*/v1/player/feed/posts', async ({ request }) => {
    await wait();
    try {
      const body = (await request.json()) as CreatePostInput;
      return HttpResponse.json(feedState.createPost(body));
    } catch (error) {
      if (error instanceof Error && error.message === 'PROFILE_PRIVATE') {
        return HttpResponse.json({ code: 'PROFILE_PRIVATE', message: 'Perfil privado' }, { status: 403 });
      }
      if (error instanceof Error && (error.message === 'EMPTY_BODY' || error.message === 'NO_PICKS')) {
        return HttpResponse.json({ code: error.message, message: 'Datos invalidos' }, { status: 400 });
      }
      return HttpResponse.json({ code: 'UNKNOWN', message: 'No se pudo publicar' }, { status: 400 });
    }
  }),
  http.post('*/v1/player/feed/posts/:postId/like', async ({ params }) => {
    await wait();
    try {
      return HttpResponse.json(feedState.toggleLike(String(params.postId)));
    } catch {
      return HttpResponse.json({ code: 'POST_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.get('*/v1/player/feed/posts/:postId/comments', async ({ params }) => {
    await wait();
    return HttpResponse.json(feedState.getComments(String(params.postId)));
  }),
  http.post('*/v1/player/feed/posts/:postId/comments', async ({ params, request }) => {
    await wait();
    const body = (await request.json()) as { body: string };
    try {
      return HttpResponse.json(feedState.addComment(String(params.postId), body.body));
    } catch {
      return HttpResponse.json({ code: 'POST_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.post('*/v1/player/feed/posts/:postId/copy-pick', async ({ params, request }) => {
    await wait();
    const body = (await request.json()) as { pickId: string };
    try {
      return HttpResponse.json(feedState.copyPick(String(params.postId), body.pickId));
    } catch {
      return HttpResponse.json({ code: 'PICK_NOT_FOUND' }, { status: 404 });
    }
  }),
  http.get('*/v1/player/feed-posts', async ({ request }) => {
    await wait();
    const scope = (new URL(request.url).searchParams.get('scope') ?? 'following') as FeedScope;
    return HttpResponse.json(feedState.list(scope));
  }),
  http.get('*/v1/player/news', async () => {
    await wait();
    return HttpResponse.json(mockNews);
  }),
  http.get('*/v1/player/notifications', async () => {
    await wait();
    return HttpResponse.json(mockNotifications);
  }),
  http.get('*/v1/player/active-boosts', async () => {
    await wait();
    return HttpResponse.json(mockActiveBoosts);
  }),
  http.get('*/v1/player/predictions/events', async ({ request }) => {
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
  http.get('*/v1/player/predictions/events/:id', async ({ params }) => {
    await wait();
    return HttpResponse.json(mockPredictionEvents.find((event) => event.id === params.id) ?? mockPredictionEvents[0]);
  }),
  http.post('*/v1/player/predictions/events/:id/predict', async ({ params, request }) => {
    await wait();
    const body = await request.json() as { predictions: Record<string, string> };
    const event = mockPredictionEvents.find((entry) => entry.id === params.id) ?? mockPredictionEvents[0];
    event.items = event.items.map((item) => ({ ...item, player_prediction: body.predictions[item.id] ?? item.player_prediction }));
    return HttpResponse.json({ ok: true, event });
  }),
  http.get('*/v1/player/predictions/markets', async () => {
    await wait();
    return HttpResponse.json(mockPredictionMarkets);
  }),

  http.get('*/v1/player/me/currencies', async () => {
    await wait();
    return HttpResponse.json([
      { id: 'gem-currency', code: 'GEMA', name: 'GEMA', icon_url: null, balance: 5 },
      ...mockPlayer.wallet!.map((w) => ({
        id: w.id,
        code: w.code ?? w.name.toUpperCase(),
        name: w.name,
        icon_url: w.imageUrl ?? null,
        balance: w.balance,
      })),
    ]);
  }),

  http.get('*/v1/player/raffles/me/wins', async () => {
    await wait();
    return HttpResponse.json([]);
  }),

  http.get('*/v1/player/raffles', async () => {
    await wait();
    return HttpResponse.json([
      {
        id: 'raffle-mock-1',
        code: 'sorteo_gopro',
        name: 'Sorteo GoPro Hero 12',
        description: 'Participá con gemas',
        image_url: null,
        status: 'open',
        entry_cost_currency_id: 'gem-currency',
        entry_cost_amount: 1,
        total_entries: 1250,
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        vip_only: false,
        max_entries_per_player: 50,
        server_seed_commitment: 'abc123',
        server_seed_revealed: null,
        prizes: [{ position: 1, prize_type: 'physical', prize_physical_name: 'GoPro Hero 12', prize_physical_image_url: null, prize_bonus_id: null }],
      },
    ]);
  }),

  http.get('*/v1/player/raffles/:code', async ({ params }) => {
    await wait();
    const code = String(params.code);
    return HttpResponse.json({
      id: 'raffle-mock-1',
      code,
      name: 'Sorteo GoPro Hero 12',
      description: 'Participá con gemas',
      image_url: null,
      status: 'open',
      entry_cost_currency_id: 'gem-currency',
      entry_cost_amount: 1,
      total_entries: 1250,
      deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
      vip_only: false,
      max_entries_per_player: 50,
      server_seed_commitment: 'abc123def4567890',
      server_seed_revealed: null,
      my_entries_count: 8,
      my_ticket_numbers: [142, 143, 144, 145, 146, 147, 148, 149],
      prizes: [{ position: 1, prize_type: 'physical', prize_physical_name: 'GoPro Hero 12', prize_physical_image_url: null, prize_bonus_id: null }],
    });
  }),

  http.post('*/v1/player/raffles/:code/enter', async ({ request }) => {
    await wait();
    const body = (await request.json()) as { entries_count: number };
    const n = body.entries_count ?? 1;
    return HttpResponse.json({
      entries: n,
      gems_debited: n,
      gems_balance_after: 42,
      ticket_numbers: Array.from({ length: n }, (_, i) => 200 + i),
    });
  }),

  http.post('*/v1/player/push-tokens/subscribe', async ({ request }) => {
    await wait();
    const body = (await request.json()) as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    if (typeof body.endpoint !== 'string' || !body.keys?.p256dh || !body.keys?.auth) {
      return HttpResponse.json({ detail: 'Invalid subscription payload' }, { status: 400 });
    }
    return HttpResponse.json({ data: { id: crypto.randomUUID() } });
  }),

  http.delete('*/v1/player/push-tokens/unsubscribe', async ({ request }) => {
    await wait();
    const body = (await request.json()) as { endpoint?: string };
    if (typeof body.endpoint !== 'string') {
      return HttpResponse.json({ detail: 'endpoint required' }, { status: 400 });
    }
    return HttpResponse.json({ data: { removed: true } });
  }),
];
