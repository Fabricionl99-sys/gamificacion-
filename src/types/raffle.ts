export type RaffleStatus = 'draft' | 'open' | 'drawing' | 'closed' | 'cancelled';
export type RafflePrizeType = 'bonus' | 'physical';

export interface RafflePrize {
  position: number;
  prizeType: RafflePrizeType;
  label: string;
  imageUrl?: string | null;
}

export interface Raffle {
  id: string;
  code: string;
  name: string;
  description: string;
  imageUrl: string | null;
  status: RaffleStatus;
  entryCostAmount: number;
  entryCostCurrencyId: string;
  entryCostCurrencyCode?: string | null;
  entryCostCurrencyName?: string | null;
  entryCostLabel: string;
  totalEntries: number;
  deadline: string | null;
  drawnAt?: string | null;
  closesIn?: string;
  vipOnly: boolean;
  mainPrizeLabel?: string;
}

export interface RaffleDetail extends Raffle {
  myEntriesCount: number;
  myTicketNumbers: number[];
  commitment: string;
  revealedSeed: string | null;
  prizes: RafflePrize[];
  maxEntriesPerPlayer: number;
}

export interface RaffleWin {
  id: string;
  raffleCode: string;
  raffleName: string;
  imageUrl: string | null;
  position: number;
  prizeType: RafflePrizeType;
  prizeLabel: string;
  notifiedAt: string | null;
  physicalDeliveredAt: string | null;
}

export interface EnterRaffleResult {
  entries: number;
  gemsDebited: number;
  gemsBalanceAfter: number;
  ticketNumbers: number[];
}
