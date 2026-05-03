export type TournamentStatus = 'live' | 'open' | 'vip' | 'almostFull' | 'finished';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  status: TournamentStatus;
  prizePool: string;
  participants: number;
  capacity: number;
  startsIn?: string;
  endsIn?: string;
  myPosition?: number;
  xp?: number;
  vipRequired?: string;
}
