import { addDays } from 'date-fns';

import type { Mission } from '../types/mission';

const now = new Date();

/** Misiones demo con requisitos visibles en checklist (JP_Slots, Nueva Mision JP). */
export const mockBackendPlayerMissions = [
  {
    mission_assignment_id: 'assign-jp-slots',
    mission_id: 'mission-jp-slots',
    code: 'JP_Slots',
    name: 'JP Slots',
    description: 'Apostá en slots y completá KYC para desbloquear la recompensa.',
    category: 'casino',
    cadence: 'daily',
    status: 'pending',
    expires_at: addDays(now, 1).toISOString(),
    claimed_at: null as string | null,
    current_step: {
      actions: [
        {
          id: 'act-bet',
          config: { type: 'bet_amount', amount: 1003, currency_code: 'USD', aggregation_mode: 'cumulative' },
          current_value: 250,
          target_value: 1003,
          is_complete: false,
        },
        {
          id: 'act-kyc',
          config: { type: 'verify_kyc' },
          current_value: 0,
          target_value: 1,
          is_complete: false,
        },
      ],
      rewards: [{ reward_config: { kind: 'xp', amount: 120 } }],
    },
  },
  {
    mission_assignment_id: 'assign-jp-nueva',
    mission_id: 'mission-jp-nueva',
    code: 'Nueva_Mision_JP',
    name: 'Nueva Mision JP',
    description: 'Depositá, verificá email y completá el step extra.',
    category: 'casino',
    cadence: 'daily',
    status: 'pending',
    expires_at: addDays(now, 2).toISOString(),
    claimed_at: null as string | null,
    current_step: {
      actions: [
        {
          id: 'act-dep',
          config: { type: 'deposit_amount', amount: 100, currency_code: 'USD' },
          current_value: 0,
          target_value: 100,
          is_complete: false,
        },
        {
          id: 'act-email',
          config: { type: 'verify_email' },
          current_value: 1,
          target_value: 1,
          is_complete: true,
        },
        {
          id: 'act-login',
          config: { type: 'login' },
          current_value: 0,
          target_value: 1,
          is_complete: false,
        },
      ],
      rewards: [{ reward_config: { description: '80 XP' } }],
    },
  },
];

export function mockMissionsAsPlayerRows(missions: Mission[]) {
  return missions.map((mission) => ({
    mission_assignment_id: mission.id,
    name: mission.title,
    description: mission.description,
    category: mission.category,
    cadence: mission.group,
    status: mission.status,
    expires_at: mission.expiresAt,
    claimed_at: mission.claimedAt ?? null,
    progress: mission.progress,
    progress_target: mission.target,
    reward_xp: mission.rewardXP,
    reward_coins: mission.rewardCoins,
    lock_reason: mission.lockReason,
    requirements: mission.requirements,
  }));
}
