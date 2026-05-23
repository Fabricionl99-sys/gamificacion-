import { apiClient } from './client';
import type {
  CopyPickResponse,
  CreatePostInput,
  FeedComment,
  FeedPost,
  FeedScope,
  LikePostResponse,
  NewsItem,
  ShareablePick,
} from '../types/social';

export const feedApi = {
  list: async (scope: FeedScope = 'following') =>
    apiClient.get('/v1/player/feed', { params: { scope } }).then((response) => response.data as FeedPost[]),
  getShareablePicks: async () =>
    apiClient.get('/v1/player/feed/shareable-picks').then((response) => response.data as ShareablePick[]),
  createPost: async (input: CreatePostInput) =>
    apiClient.post('/v1/player/feed/posts', input).then((response) => response.data as FeedPost),
  toggleLike: async (postId: string) =>
    apiClient.post(`/v1/player/feed/posts/${postId}/like`).then((response) => response.data as LikePostResponse),
  getComments: async (postId: string) =>
    apiClient.get(`/v1/player/feed/posts/${postId}/comments`).then((response) => response.data as FeedComment[]),
  addComment: async (postId: string, body: string) =>
    apiClient
      .post(`/v1/player/feed/posts/${postId}/comments`, { body })
      .then((response) => response.data as FeedComment),
  copyPick: async (postId: string, pickId: string) =>
    apiClient
      .post(`/v1/player/feed/posts/${postId}/copy-pick`, { pickId })
      .then((response) => response.data as CopyPickResponse),
};

export const getNews = async () => apiClient.get('/v1/player/news').then((response) => response.data as NewsItem[]);
