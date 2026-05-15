import { subHours } from 'date-fns';

import type {
  CreatePostInput,
  FeedComment,
  FeedPost,
  FeedScope,
  ShareablePick,
} from '../types/social';
import { mockPlayer, mockPosts, mockShareablePicks } from './index';
import { readPublicProfile } from '../utils/profilePrivacy';

const followingAuthorIds = new Set(['player-002', 'player-003', 'player-004']);

const seedComments: FeedComment[] = [
  {
    id: 'comment-001',
    postId: 'post-001',
    authorId: 'player-003',
    authorName: 'Sofia R.',
    authorAvatar: 'SR',
    body: 'Buena lectura, voy con el over tambien.',
    createdAt: subHours(new Date(), 1).toISOString(),
  },
  {
    id: 'comment-002',
    postId: 'post-001',
    authorId: mockPlayer.id,
    authorName: mockPlayer.name,
    authorAvatar: mockPlayer.avatar,
    body: 'Sin montos, solo analisis del partido.',
    createdAt: subHours(new Date(), 0.5).toISOString(),
  },
];

function clonePosts(): FeedPost[] {
  return structuredClone(mockPosts);
}

let posts = clonePosts();
let comments = [...seedComments];
const likedPostIds = new Set<string>();
let commentCounter = seedComments.length;

function isPublicPlayer(): boolean {
  return readPublicProfile() && !mockPlayer.isPrivate;
}

function filterByScope(scope: FeedScope): FeedPost[] {
  const visible = posts.filter((post) => !post.pendingReview || post.authorId === mockPlayer.id);
  if (scope === 'following') {
    return visible.filter(
      (post) => post.authorId === mockPlayer.id || followingAuthorIds.has(post.authorId),
    );
  }
  return visible.filter(
    (post) => post.authorId !== mockPlayer.id && !followingAuthorIds.has(post.authorId),
  );
}

function withLikeState(feedPosts: FeedPost[]): FeedPost[] {
  return feedPosts.map((post) => ({
    ...post,
    likedByMe: likedPostIds.has(post.id),
  }));
}

export const feedState = {
  reset() {
    posts = clonePosts();
    comments = [...seedComments];
    likedPostIds.clear();
    commentCounter = seedComments.length;
  },
  list(scope: FeedScope) {
    return withLikeState(
      filterByScope(scope).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  },
  getShareablePicks(): ShareablePick[] {
    return structuredClone(mockShareablePicks);
  },
  createPost(input: CreatePostInput): FeedPost {
    if (!isPublicPlayer()) {
      throw new Error('PROFILE_PRIVATE');
    }
    const pickIdsOrdered = [
      ...(input.sharePickIds ?? []),
      ...(input.sharePickId && !input.sharePickIds?.length ? [input.sharePickId] : []),
    ];
    const picks = pickIdsOrdered
      .map((id) => mockShareablePicks.find((entry) => entry.id === id))
      .filter((entry): entry is ShareablePick => Boolean(entry));

    const wantsTicket = input.kind === 'bet_ticket' || (input.sharePickIds?.length ?? 0) > 0;
    const caption = input.body.trim();

    let betSlip: FeedPost['betSlip'];
    let kind: FeedPost['kind'] = 'thought';

    if (wantsTicket) {
      if (picks.length === 0) {
        throw new Error('NO_PICKS');
      }
      const legs = picks.map((pick) => ({
        teams: pick.teams,
        prediction: pick.prediction,
        odds: pick.odds,
      }));
      const totalOdds = legs.reduce((acc, leg) => acc * leg.odds, 1);
      betSlip = {
        id: `slip-${Date.now()}`,
        legs,
        totalOdds: Math.round(totalOdds * 100) / 100,
        status: picks[0].status,
      };
      kind = 'bet_ticket';
    }

    if (!wantsTicket && caption.length === 0) {
      throw new Error('EMPTY_BODY');
    }

    const post: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: mockPlayer.id,
      authorName: mockPlayer.name,
      username: mockPlayer.username?.toUpperCase(),
      authorAvatar: mockPlayer.avatar,
      vipTier: mockPlayer.vipTier,
      level: mockPlayer.level,
      createdAt: new Date().toISOString(),
      kind,
      body: caption,
      likes: 0,
      comments: 0,
      likedByMe: false,
      betSlip,
      pendingReview: false,
    };
    posts = [post, ...posts];
    return post;
  },
  toggleLike(postId: string) {
    const post = posts.find((entry) => entry.id === postId);
    if (!post) throw new Error('POST_NOT_FOUND');
    if (likedPostIds.has(postId)) {
      likedPostIds.delete(postId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      likedPostIds.add(postId);
      post.likes += 1;
    }
    return {
      postId,
      likes: post.likes,
      likedByMe: likedPostIds.has(postId),
    };
  },
  getComments(postId: string) {
    return comments
      .filter((entry) => entry.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  addComment(postId: string, body: string) {
    const post = posts.find((entry) => entry.id === postId);
    if (!post) throw new Error('POST_NOT_FOUND');
    commentCounter += 1;
    const comment: FeedComment = {
      id: `comment-${commentCounter}`,
      postId,
      authorId: mockPlayer.id,
      authorName: mockPlayer.name,
      authorAvatar: mockPlayer.avatar,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    comments = [...comments, comment];
    post.comments += 1;
    return comment;
  },
  copyPick(postId: string, pickId: string) {
    const post = posts.find((entry) => entry.id === postId);
    if (!post) throw new Error('POST_NOT_FOUND');

    if (post.betSlip && post.betSlip.id === pickId) {
      const { legs, totalOdds, bookingCode } = post.betSlip;
      return {
        postId,
        pickId,
        teams: legs.map((leg) => leg.teams).join(' · '),
        prediction: legs.map((leg) => leg.prediction).join(' · '),
        odds: totalOdds,
        totalOdds,
        legs,
        bookingCode,
      };
    }

    if (!post.sharedPick || post.sharedPick.id !== pickId) {
      throw new Error('PICK_NOT_FOUND');
    }
    return {
      postId,
      pickId,
      teams: post.sharedPick.teams,
      prediction: post.sharedPick.prediction,
      odds: post.sharedPick.odds,
    };
  },
};
