import { getJson } from './fetchJson';

export type StreakProgram = {
  id: string;
  code?: string;
  name: string;
  description?: string;
  current_streak?: number;
  best_streak?: number;
  next_reward_at_day?: number;
  next_reward_label?: string;
};

export type StreaksResponse = {
  programs: StreakProgram[];
  current_streak?: number;
  best_streak?: number;
};

export async function getStreaks(): Promise<StreaksResponse> {
  const data = await getJson<StreaksResponse | StreakProgram[]>('/v1/player/streaks');
  if (Array.isArray(data)) return { programs: data };
  return { programs: data.programs ?? [], current_streak: data.current_streak, best_streak: data.best_streak };
}
