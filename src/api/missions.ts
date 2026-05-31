import type { Mission, MissionCategory, MissionStatus } from '../types/mission';
import { getJson, postJson } from './fetchJson';

interface BackendMission {
  id?: string;
  assignment_id?: string;
  mission_id?: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  cadence?: string;
  group?: string;
  progress?: number;
  progress_current?: number;
  progress_target?: number;
  target?: number;
  reward_xp?: number;
  rewardXP?: number;
  reward_coins?: number;
  rewardCoins?: number;
  expires_at?: string;
  status?: string;
  lock_reason?: string;
}

function mapGroup(raw: BackendMission): Mission['group'] {
  const value = (raw.group ?? raw.cadence ?? 'daily').toLowerCase();
  if (value.includes('week')) return 'weekly';
  if (value.includes('event')) return 'event';
  if (value.includes('lock')) return 'locked';
  return 'daily';
}

function mapStatus(raw: BackendMission): MissionStatus {
  const value = (raw.status ?? 'pending').toLowerCase();
  if (value === 'completed' || value === 'complete') return 'completed';
  if (value === 'claimed') return 'claimed';
  if (value === 'expired') return 'expired';
  if (value === 'locked') return 'locked';
  return 'pending';
}

function adaptMission(raw: BackendMission): Mission {
  return {
    id: String(raw.assignment_id ?? raw.id ?? raw.mission_id),
    title: raw.title ?? raw.name ?? 'Misión',
    description: raw.description ?? '',
    category: (raw.category ?? 'casino') as MissionCategory,
    group: mapGroup(raw),
    progress: Number(raw.progress ?? raw.progress_current) || 0,
    target: Number(raw.progress_target ?? raw.target) || 1,
    rewardXP: Number(raw.reward_xp ?? raw.rewardXP) || 0,
    rewardCoins: raw.reward_coins != null ? Number(raw.reward_coins) : raw.rewardCoins,
    expiresAt: raw.expires_at,
    status: mapStatus(raw),
    lockReason: raw.lock_reason,
  };
}

export async function getMissions(): Promise<Mission[]> {
  const rows = await getJson<BackendMission[]>('/v1/player/missions');
  return rows.map(adaptMission);
}

export interface ClaimMissionResult {
  mission: Mission;
  rewardXP: number;
  rewardCoins: number;
}

export async function claimMission(missionId: string): Promise<ClaimMissionResult> {
  return postJson<ClaimMissionResult>(`/v1/player/missions/${missionId}/claim`);
}
