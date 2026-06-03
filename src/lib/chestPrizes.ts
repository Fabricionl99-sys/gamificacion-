export interface ChestPrizeDisplay {
  id: string;
  label: string;
  name?: string;
  emoji?: string;
  imageUrl?: string | null;
  isRare?: boolean;
}

export interface ChestOpenResult {
  prize_index: number;
  prize: ChestPrizeDisplay;
  prizes: ChestPrizeDisplay[];
}

/** Pool demo cuando el backend aún no devuelve premios en el open. */
export const DEFAULT_CHEST_PRIZE_POOL: ChestPrizeDisplay[] = [
  { id: 'p1', label: '+100 XP', emoji: '⚡', isRare: false },
  { id: 'p2', label: '50 monedas', emoji: '🪙', isRare: false },
  { id: 'p3', label: '15 free spins', emoji: '🎰', isRare: false },
  { id: 'p4', label: 'Bono sorpresa', emoji: '🎁', isRare: true },
  { id: 'p5', label: 'x2 XP 1h', emoji: '🔥', isRare: false },
  { id: 'p6', label: '+250 XP', emoji: '⭐', isRare: false },
];

export function normalizeChestPrize(raw: Record<string, unknown>, index: number): ChestPrizeDisplay {
  return {
    id: String(raw.id ?? `prize-${index}`),
    label: String(raw.label ?? raw.name ?? `Premio ${index + 1}`),
    name: typeof raw.name === 'string' ? raw.name : undefined,
    emoji: typeof raw.emoji === 'string' ? raw.emoji : undefined,
    imageUrl:
      typeof raw.image_url === 'string'
        ? raw.image_url
        : typeof raw.imageUrl === 'string'
          ? raw.imageUrl
          : null,
    isRare: Boolean(raw.is_rare ?? raw.isRare),
  };
}

export function normalizeChestOpenResult(body: unknown): ChestOpenResult {
  const raw = body as Record<string, unknown>;
  const prizeList = Array.isArray(raw.prizes)
    ? raw.prizes.map((p, i) => normalizeChestPrize(p as Record<string, unknown>, i))
    : DEFAULT_CHEST_PRIZE_POOL;

  const prizeIndex = Number(raw.prize_index ?? 0);
  const prizeRaw = raw.prize as Record<string, unknown> | undefined;
  const prize = prizeRaw ? normalizeChestPrize(prizeRaw, prizeIndex) : prizeList[prizeIndex] ?? prizeList[0]!;

  return {
    prize_index: Number.isFinite(prizeIndex) ? prizeIndex : 0,
    prize,
    prizes: prizeList.length ? prizeList : DEFAULT_CHEST_PRIZE_POOL,
  };
}
