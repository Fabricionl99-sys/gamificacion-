import type { Player, VipTier } from '../types/player';
import type { LevelDefinition } from '../types/levels';
import type { WalletCurrency } from '../types/currency';

function normalizeWalletEntry(raw: Record<string, unknown>): WalletCurrency {
  const code = typeof raw.code === 'string' ? raw.code : undefined;
  return {
    id: String(raw.id ?? raw.currency_id ?? code ?? ''),
    code,
    name: String(raw.name ?? raw.currency_name ?? code ?? 'Moneda'),
    balance: asNumber(raw.balance),
    imageUrl:
      typeof raw.icon_url === 'string'
        ? raw.icon_url
        : typeof raw.image_url === 'string'
          ? raw.image_url
          : typeof raw.imageUrl === 'string'
            ? raw.imageUrl
            : undefined,
  };
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

const VIP_TIERS: VipTier[] = ['none', 'bronze', 'silver', 'gold', 'diamond'];

function asVipTier(value: unknown): VipTier {
  const tier = asString(value, 'none').toLowerCase() as VipTier;
  return VIP_TIERS.includes(tier) ? tier : 'none';
}

export function normalizePlayer(raw: Record<string, unknown>): Player {
  const walletSource = raw.wallet ?? raw.wallets ?? (Array.isArray(raw.coins) ? raw.coins : undefined);
  const wallet = Array.isArray(walletSource)
    ? walletSource.map((row) => normalizeWalletEntry(row as Record<string, unknown>))
    : undefined;
  const primaryCoinBalance = wallet?.[0]?.balance;

  return {
    id: asString(raw.id ?? raw.player_id),
    name: asString(raw.name ?? raw.display_name, 'Jugador'),
    username: asString(raw.username ?? raw.handle ?? raw.external_player_id),
    avatar: asString(raw.avatar ?? raw.avatar_url),
    level: asNumber(raw.level ?? raw.current_level, 1),
    currentXP: asNumber(raw.currentXP ?? raw.current_xp ?? raw.total_xp),
    nextLevelXP: asNumber(raw.nextLevelXP ?? raw.next_level_xp ?? raw.xp_to_next_level, 1),
    streak: asNumber(raw.streak ?? raw.current_streak),
    bestStreak: asNumber(raw.bestStreak ?? raw.best_streak),
    coins: typeof raw.coins === 'number' ? asNumber(raw.coins) : (primaryCoinBalance ?? 0),
    vipTier: asVipTier(raw.vipTier ?? raw.vip_tier),
    bio: asString(raw.bio),
    pendingPrizes: asNumber(raw.pendingPrizes ?? raw.pending_prizes),
    unreadNotifications: asNumber(raw.unreadNotifications ?? raw.unread_notifications),
    isPrivate: Boolean(raw.isPrivate ?? raw.is_private),
    followers: raw.followers !== undefined ? asNumber(raw.followers) : undefined,
    following: raw.following !== undefined ? asNumber(raw.following) : undefined,
    levelDefinitions: (raw.levelDefinitions ?? raw.level_definitions) as LevelDefinition[] | undefined,
    wallet,
  };
}
