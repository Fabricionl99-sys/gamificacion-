import { apiClient } from './client';
import type { FeedPost, NewsItem } from '../types/social';

export const feedApi = {
  list: async () => apiClient.get('/player/feed').then((response) => response.data as FeedPost[]),
};

export const getNews = async () => apiClient.get('/player/news').then((response) => response.data as NewsItem[]);
