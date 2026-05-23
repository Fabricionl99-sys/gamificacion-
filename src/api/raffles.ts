import type { EnterRaffleResult, Raffle, RaffleDetail, RafflePrize, RaffleWin } from '../types/raffle';
import { apiClient } from './client';

interface BackendPrize {
  position: number;
  prize_type: 'bonus' | 'physical';
  prize_physical_name: string | null;
  prize_physical_image_url: string | null;
  prize_bonus_id: string | null;
}

interface BackendRaffleRow {
  id: string;
  code: string;
  name: string;
  description: string;
  image_url: string | null;
  status: Raffle['status'];
  entry_cost_currency_id: string;
  entry_cost_currency_code?: string | null;
  entry_cost_currency_name?: string | null;
  entry_cost_amount: number;
  total_entries: number;
  deadline: string;
  vip_only: boolean;
  max_entries_per_player: number;
  server_seed_commitment: string;
  server_seed_revealed: string | null;
  prizes?: BackendPrize[];
}

interface BackendRaffleDetail extends BackendRaffleRow {
  my_entries_count?: number;
  my_ticket_numbers?: number[];
  prizes: BackendPrize[];
}

interface BackendWin {
  id: string;
  raffle_id: string;
  position: number;
  winning_ticket_number: number;
  notified_at: string | null;
  physical_delivered_at: string | null;
  raffle_name?: string;
  raffle_code?: string;
  prize_physical_name?: string | null;
  prize_type?: 'bonus' | 'physical';
}

function formatTimeDelta(iso: string, now = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  if (diffMs <= 0) return 'cerrado';
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function adaptPrize(p: BackendPrize): RafflePrize {
  return {
    position: p.position,
    prizeType: p.prize_type,
    label: p.prize_type === 'physical' ? p.prize_physical_name ?? 'Premio físico' : 'Bono',
    imageUrl: p.prize_physical_image_url,
  };
}

function adaptRow(r: BackendRaffleRow): Raffle {
  const prizes = r.prizes ?? [];
  const first = prizes.find((p) => p.position === 1);
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description ?? '',
    imageUrl: r.image_url,
    status: r.status,
    entryCostAmount: r.entry_cost_amount,
    entryCostCurrencyId: r.entry_cost_currency_id,
    entryCostCurrencyCode: r.entry_cost_currency_code ?? null,
    entryCostCurrencyName: r.entry_cost_currency_name ?? null,
    entryCostLabel: `${r.entry_cost_amount} gema${r.entry_cost_amount === 1 ? '' : 's'}`,
    totalEntries: r.total_entries,
    deadline: r.deadline,
    closesIn: formatTimeDelta(r.deadline),
    vipOnly: r.vip_only,
    mainPrizeLabel: first ? adaptPrize(first).label : undefined,
  };
}

function adaptDetail(r: BackendRaffleDetail): RaffleDetail {
  const base = adaptRow(r);
  const prizes = (r.prizes ?? []).map(adaptPrize).sort((a, b) => a.position - b.position);
  return {
    ...base,
    myEntriesCount: r.my_entries_count ?? 0,
    myTicketNumbers: r.my_ticket_numbers ?? [],
    commitment: r.server_seed_commitment,
    revealedSeed: r.server_seed_revealed,
    prizes,
    maxEntriesPerPlayer: r.max_entries_per_player,
    mainPrizeLabel: prizes[0]?.label,
  };
}

function adaptWin(w: BackendWin): RaffleWin {
  return {
    id: w.id,
    raffleCode: w.raffle_code ?? '',
    raffleName: w.raffle_name ?? 'Sorteo',
    imageUrl: null,
    position: w.position,
    prizeType: w.prize_type ?? 'bonus',
    prizeLabel: w.prize_physical_name ?? 'Premio',
    notifiedAt: w.notified_at,
    physicalDeliveredAt: w.physical_delivered_at,
  };
}

export async function getRaffles(): Promise<Raffle[]> {
  const { data } = await apiClient.get<BackendRaffleRow[]>('/v1/player/raffles');
  return data.filter((r) => !r.vip_only && r.status !== 'draft' && r.status !== 'cancelled').map(adaptRow);
}

export async function getRaffleDetail(code: string): Promise<RaffleDetail> {
  const { data } = await apiClient.get<BackendRaffleDetail>(`/v1/player/raffles/${code}`);
  return adaptDetail(data);
}

export async function getMyRaffleWins(): Promise<RaffleWin[]> {
  const { data } = await apiClient.get<BackendWin[]>('/v1/player/raffles/me/wins');
  return data.map(adaptWin);
}

export async function enterRaffle(code: string, entriesCount: number): Promise<EnterRaffleResult> {
  const { data } = await apiClient.post<{
    entries: number;
    gems_debited: number;
    gems_balance_after: number;
    ticket_numbers?: number[];
  }>(`/v1/player/raffles/${code}/enter`, { entries_count: entriesCount });
  return {
    entries: data.entries,
    gemsDebited: data.gems_debited,
    gemsBalanceAfter: data.gems_balance_after,
    ticketNumbers: data.ticket_numbers ?? [],
  };
}

export function ticketRangeLabel(nums: number[]): string {
  if (nums.length === 0) return '—';
  const sorted = [...nums].sort((a, b) => a - b);
  if (sorted.length === 1) return `#${sorted[0]}`;
  return `#${sorted[0]}–#${sorted[sorted.length - 1]}`;
}

export function winChancePercent(myCount: number, total: number): string {
  if (total <= 0 || myCount <= 0) return '0%';
  return `${((myCount / total) * 100).toFixed(2)}%`;
}
