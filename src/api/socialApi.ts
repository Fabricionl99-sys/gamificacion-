import type {
  FollowResult,
  LikePostResult,
  SocialBlockedUser,
  SocialComment,
  SocialCursorPage,
  SocialFollowRequest,
  SocialPost,
  SocialProfileMe,
  SocialProfilePublic,
  UnlikePostResult,
  UpdateSocialProfileInput,
} from '../types/socialModule';
import { apiClient } from './client';

const BASE = '/v1/player/social';

function withCursor(path: string, cursor?: string | null) {
  if (!cursor) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}cursor=${encodeURIComponent(cursor)}`;
}

export const socialApi = {
  getMyProfile: () => apiClient.get(`${BASE}/profile/me`).then((r) => r.data as SocialProfileMe),

  updateMyProfile: (input: UpdateSocialProfileInput) =>
    apiClient.patch(`${BASE}/profile/me`, input).then((r) => r.data as SocialProfileMe),

  getProfile: (playerStateId: string) =>
    apiClient.get(`${BASE}/profile/${playerStateId}`).then((r) => r.data as SocialProfilePublic),

  getFeed: (cursor?: string | null) =>
    apiClient.get(withCursor(`${BASE}/posts/feed`, cursor)).then((r) => r.data as SocialCursorPage<SocialPost>),

  getExplore: (cursor?: string | null) =>
    apiClient.get(withCursor(`${BASE}/posts/explore`, cursor)).then((r) => r.data as SocialCursorPage<SocialPost>),

  getPostsByAuthor: (playerStateId: string, cursor?: string | null) =>
    apiClient
      .get(withCursor(`${BASE}/posts/by-author/${playerStateId}`, cursor))
      .then((r) => r.data as SocialCursorPage<SocialPost>),

  createPost: (content: string) =>
    apiClient.post(`${BASE}/posts`, { content }).then((r) => r.data as SocialPost),

  likePost: (postId: string) =>
    apiClient.post(`${BASE}/posts/${postId}/like`).then((r) => r.data as LikePostResult),

  unlikePost: (postId: string) =>
    apiClient.delete(`${BASE}/posts/${postId}/like`).then((r) => r.data as UnlikePostResult),

  getComments: (postId: string, cursor?: string | null) =>
    apiClient
      .get(withCursor(`${BASE}/posts/${postId}/comments`, cursor))
      .then((r) => r.data as SocialCursorPage<SocialComment>),

  addComment: (postId: string, content: string) =>
    apiClient.post(`${BASE}/posts/${postId}/comments`, { content }).then((r) => r.data as SocialComment),

  deleteComment: (commentId: string) => apiClient.delete(`${BASE}/comments/${commentId}`),

  reportPost: (postId: string, reason: string) =>
    apiClient.post(`${BASE}/posts/${postId}/report`, { reason }),

  follow: (playerStateId: string) =>
    apiClient.post(`${BASE}/follows/${playerStateId}`).then((r) => r.data as FollowResult),

  unfollow: (playerStateId: string) => apiClient.delete(`${BASE}/follows/${playerStateId}`),

  getFollowRequests: (cursor?: string | null) =>
    apiClient
      .get(withCursor(`${BASE}/follows/requests`, cursor))
      .then((r) => r.data as SocialCursorPage<SocialFollowRequest>),

  acceptFollowRequest: (followId: string) =>
    apiClient.post(`${BASE}/follows/requests/${followId}/accept`),

  rejectFollowRequest: (followId: string) =>
    apiClient.post(`${BASE}/follows/requests/${followId}/reject`),

  getBlocks: (cursor?: string | null) =>
    apiClient.get(withCursor(`${BASE}/blocks`, cursor)).then((r) => r.data as SocialCursorPage<SocialBlockedUser>),

  blockUser: (playerStateId: string) => apiClient.post(`${BASE}/blocks/${playerStateId}`),

  unblockUser: (playerStateId: string) => apiClient.delete(`${BASE}/blocks/${playerStateId}`),
};
