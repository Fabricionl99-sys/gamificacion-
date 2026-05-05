export type GameCategory = 'deportes' | 'casino' | 'casino_vivo' | 'virtuales' | 'poker';
export type GameCategoryCode = GameCategory;

export const GAME_CATEGORIES: Record<GameCategory, string> = {
  deportes: 'Deportes',
  casino: 'Casino',
  casino_vivo: 'Casino en vivo',
  virtuales: 'Virtuales',
  poker: 'Poker',
};

export const CATEGORY_LABELS = GAME_CATEGORIES;
