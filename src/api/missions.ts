import type { Mission, MissionCategory, MissionStatus } from '../types/mission';
import { getJson, postJson } from './fetchJson';

interface BackendMissionAction {
  progress?: number;
  progress_current?: number;
  target?: number;
  progress_target?: number;
}

interface BackendMission {
  id?: string;
  assignment_id?: string;
  mission_assignment_id?: string;
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
  claimed_at?: string | null;
  current_step?: {
    actions?: BackendMissionAction[];
  };
}

function sumActionProgress(actions: BackendMissionAction[]): { progress: number; target: number } {
  if (actions.length === 0) return { progress: 0, target: 1 };
  const progress = actions.reduce((acc, a) => acc + (Number(a.progress ?? a.progress_current) || 0), 0);
  const target = actions.reduce((acc, a) => acc + (Number(a.target ?? a.progress_target) || 0), 0) || 1;
  return { progress, target };
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
  if (raw.claimed_at) return 'claimed';
  if (value === 'completed' || value === 'complete') return 'completed';
  if (value === 'claimed') return 'claimed';
  if (value === 'expired') return 'expired';
  if (value === 'locked') return 'locked';
  return 'pending';
}

function adaptMission(raw: BackendMission): Mission {
  const actions = raw.current_step?.actions ?? [];
  const fromActions = sumActionProgress(actions);
  const progress = actions.length > 0 ? fromActions.progress : Number(raw.progress ?? raw.progress_current) || 0;
  const target =
    actions.length > 0 ? fromActions.target : Number(raw.progress_target ?? raw.target) || 1;

  return {
    id: String(raw.mission_assignment_id ?? raw.assignment_id ?? raw.id ?? raw.mission_id),
    title: raw.title ?? raw.name ?? 'Misión',
    description: raw.description ?? '',
    category: (raw.category ?? 'casino') as MissionCategory,
    group: mapGroup(raw),
    progress,
    target,
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

export async function claimMission(missionAssignmentId: string): Promise<ClaimMissionResult> {
  return postJson<ClaimMissionResult>(`/v1/player/missions/${missionAssignmentId}/claim`);
}
