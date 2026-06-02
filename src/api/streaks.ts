import { getJson, postJson } from './fetchJson';

export type StreakActivityType = 'login' | 'deposit' | 'bet';

export type StreakMilestone = {
  day_number: number;
  reward_config: Record<string, unknown>;
  reward_type_id?: number;
};

export type StreakPlayerState = {
  current_day: number;
  status: string;
  last_claim_at?: string | null;
};

export type StreakNextReward = {
  next_day_number: number;
  milestone?: StreakMilestone;
  micro_reward?: unknown;
};

export type StreakProgram = {
  streak_program_id: string;
  name: string;
  activity_type: StreakActivityType;
  description?: string;
  milestones: StreakMilestone[];
  player_state: StreakPlayerState | null;
  next_reward: StreakNextReward | null;
};

export type StreaksResponse = {
  programs: StreakProgram[];
  current_streak?: number;
  best_streak?: number;
};

function adaptMilestone(raw: Record<string, unknown>): StreakMilestone {
  return {
    day_number: Number(raw.day_number ?? 0),
    reward_config: (raw.reward_config as Record<string, unknown>) ?? {},
    reward_type_id: typeof raw.reward_type_id === 'number' ? raw.reward_type_id : undefined,
  };
}

function adaptProgram(raw: Record<string, unknown>): StreakProgram {
  const milestonesRaw = Array.isArray(raw.milestones) ? raw.milestones : [];
  const playerRaw = raw.player_state as Record<string, unknown> | null | undefined;
  const nextRaw = raw.next_reward as Record<string, unknown> | null | undefined;

  return {
    streak_program_id: String(raw.streak_program_id ?? raw.id ?? ''),
    name: String(raw.name ?? 'Programa de asistencia'),
    activity_type: (raw.activity_type as StreakActivityType) ?? 'login',
    description: typeof raw.description === 'string' ? raw.description : undefined,
    milestones: milestonesRaw.map((m) => adaptMilestone(m as Record<string, unknown>)),
    player_state: playerRaw
      ? {
          current_day: Number(playerRaw.current_day ?? 0),
          status: String(playerRaw.status ?? 'active'),
          last_claim_at: (playerRaw.last_claim_at as string | null) ?? null,
        }
      : null,
    next_reward: nextRaw
      ? {
          next_day_number: Number(nextRaw.next_day_number ?? 0),
          milestone: nextRaw.milestone
            ? adaptMilestone(nextRaw.milestone as Record<string, unknown>)
            : undefined,
          micro_reward: nextRaw.micro_reward,
        }
      : null,
  };
}

function adaptLegacyProgram(raw: Record<string, unknown>): StreakProgram {
  return {
    streak_program_id: String(raw.id ?? raw.streak_program_id ?? ''),
    name: String(raw.name ?? 'Programa'),
    activity_type: 'login',
    description: typeof raw.description === 'string' ? raw.description : undefined,
    milestones: [],
    player_state: null,
    next_reward: raw.next_reward_at_day
      ? { next_day_number: Number(raw.next_reward_at_day) }
      : null,
  };
}

export async function getStreaks(): Promise<StreaksResponse> {
  const data = await getJson<StreaksResponse | StreakProgram[] | Record<string, unknown>>('/v1/player/streaks');
  if (Array.isArray(data)) {
    return { programs: data.map((row) => adaptLegacyProgram(row as Record<string, unknown>)) };
  }
  const programsRaw = Array.isArray(data.programs) ? data.programs : [];
  const programs = programsRaw.map((row) => {
    const rec = row as Record<string, unknown>;
    return rec.streak_program_id != null || rec.activity_type != null
      ? adaptProgram(rec)
      : adaptLegacyProgram(rec);
  });
  return {
    programs,
    current_streak: typeof data.current_streak === 'number' ? data.current_streak : undefined,
    best_streak: typeof data.best_streak === 'number' ? data.best_streak : undefined,
  };
}

export async function claimStreak(streakProgramId: string): Promise<{ ok: boolean }> {
  return postJson<{ ok: boolean }>(`/v1/player/streaks/${streakProgramId}/claim`);
}
