import type { Player } from '../types/player';
import { mockPlayer } from '../mocks';

export const getPlayer = async (): Promise<Player> => mockPlayer;
