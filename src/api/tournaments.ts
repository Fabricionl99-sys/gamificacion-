import type { Tournament } from '../types/tournament';
import { mockTournaments } from '../mocks';

export async function getTournaments(): Promise<Tournament[]> {
  return mockTournaments;
}
