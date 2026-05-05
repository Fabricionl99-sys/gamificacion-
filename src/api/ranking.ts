import { apiClient } from './client';
import type { LeaderboardFull, PlayerRankingSummary } from '../types/ranking';

export const getPlayerRankings = async () =>
  apiClient.get('/player/rankings').then((response) => response.data as PlayerRankingSummary[]);

export const getRankings = getPlayerRankings;

export const getRankingLeaderboard = async (rankingId: string, limit = 20) =>
  apiClient
    .get(`/player/rankings/${rankingId}/leaderboard`, { params: { limit } })
    .then((response) => response.data as LeaderboardFull);
