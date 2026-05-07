import { addDays, subHours } from 'date-fns';
import type { Achievement } from '../types/achievement';
import type { Mission } from '../types/mission';
import type { Player, PublicPlayer } from '../types/player';
import type { LeaderboardFull, LeaderboardEntry, PlayerRankingSummary } from '../types/ranking';
import type { PredictionEvent, PredictionMarketDefinition } from '../types/prediction';
import type { ShopItem } from '../types/reward';
import type { AppNotification, FeedPost, NewsItem, ProfilePrize } from '../types/social';
import type { Tournament } from '../types/tournament';
import type { XPBoost } from '../types/boost';

const now = new Date();

export const mockPlayer: Player = {
  id: 'player-001',
  name: 'Juan Martinez',
  username: 'juanm',
  avatar: 'JM',
  level: 12,
  currentXP: 5200,
  nextLevelXP: 7250,
  streak: 12,
  bestStreak: 21,
  coins: 2150,
  vipTier: 'gold',
  bio: 'Tipster amateur, fanatico de las ligas europeas.',
  pendingPrizes: 3,
  unreadNotifications: 5,
  followers: 184,
  following: 72,
  isPrivate: false,
  levelDefinitions: [
    {
      level: 1,
      displayName: 'Aprendiz',
      badgeImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop',
    },
    {
      level: 5,
      displayName: 'Veterano',
      badgeImageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop',
    },
    {
      level: 10,
      displayName: 'Élite',
      badgeImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop',
    },
  ],
  wallet: [
    {
      id: 'coin_oro',
      name: 'Oro',
      balance: 2150,
      imageUrl: 'https://cdn-icons-png.flaticon.com/64/272/272525.png',
    },
    {
      id: 'coin_ruby',
      name: 'Rubíes',
      balance: 42,
      imageUrl: 'https://cdn-icons-png.flaticon.com/64/9431/9431065.png',
    },
  ],
};

export const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    ruleId: 'rule_sports_win',
    title: 'Hace 3 apuestas en deportes',
    description: 'Completa tres tickets deportivos para sumar XP hoy.',
    category: 'deportes',
    group: 'daily',
    progress: 2,
    target: 3,
    rewardXP: 50,
    rewardCoins: 20,
    expiresAt: addDays(now, 1).toISOString(),
    status: 'pending',
  },
  {
    id: 'mission-002',
    ruleId: 'rule_slots_bet',
    title: 'Juga 30 minutos en casino',
    description: 'Mantené actividad en slots, bingo, crash o RNG sin importar el resultado.',
    category: 'casino',
    group: 'daily',
    progress: 30,
    target: 30,
    rewardXP: 30,
    rewardCoins: 15,
    expiresAt: addDays(now, 1).toISOString(),
    status: 'completed',
  },
  {
    id: 'mission-003',
    ruleId: 'rule_feed_share',
    title: 'Publica una fija responsable',
    description: 'Compartila sin montos y suma interaccion social.',
    category: 'social',
    group: 'weekly',
    progress: 0,
    target: 1,
    rewardXP: 80,
    expiresAt: addDays(now, 4).toISOString(),
    status: 'pending',
  },
  {
    id: 'mission-004',
    ruleId: 'rule_predictions_event',
    title: 'Predice el clasico del domingo',
    description: 'Evento especial con XP adicional del operador.',
    category: 'predicciones',
    group: 'event',
    progress: 1,
    target: 1,
    rewardXP: 120,
    rewardCoins: 60,
    expiresAt: addDays(now, 2).toISOString(),
    status: 'completed',
  },
  {
    id: 'mission-005',
    ruleId: 'rule_casino_vip',
    title: 'Mision VIP Plata',
    description: 'Disponible al alcanzar VIP plata.',
    category: 'casino',
    group: 'locked',
    progress: 0,
    target: 1,
    rewardXP: 200,
    status: 'locked',
    lockReason: 'requiere VIP plata',
  },
];

export const mockActiveBoosts: XPBoost[] = [
  {
    enabled: true,
    id: 'boost_sports_weekend',
    name: 'Doble XP deportes',
    multiplier: 2,
    starts_at: addDays(now, -1).toISOString(),
    ends_at: addDays(now, 2).toISOString(),
    scope: 'category',
    category_code: 'deportes',
    rule_id: 'rule_sports_win',
    rule_name: 'Apuesta deportiva ganadora',
  },
  {
    id: 'boost_all_week',
    name: 'Semana XP x1.5',
    enabled: true,
    multiplier: 1.5,
    starts_at: addDays(now, -0.2).toISOString(),
    ends_at: addDays(now, 1).toISOString(),
    scope: 'all',
    category_code: undefined,
    rule_id: 'rule_slots_bet',
    rule_name: 'Apuesta en casino',
  },
];

export const mockPredictionMarkets: PredictionMarketDefinition[] = [
  { id:'result_1x2', label:'Resultado 1X2', buttons:[{ value:'option1', label:'local' }, { value:'draw', label:'empate' }, { value:'option2', label:'visitante' }] },
  { id:'winner_2options', label:'Ganador', buttons:[{ value:'option1', label:'opción 1' }, { value:'option2', label:'opción 2' }] },
  { id:'total_goals', label:'Total goles', buttons:[{ value:'over', label:'más 2.5' }, { value:'under', label:'menos 2.5' }] },
  { id:'total_corners', label:'Total córners', buttons:[{ value:'over', label:'más 9.5' }, { value:'under', label:'menos 9.5' }] },
  { id:'both_score', label:'Ambos marcan', buttons:[{ value:'yes', label:'sí' }, { value:'no', label:'no' }] },
  { id:'exact_score', label:'Resultado exacto', buttons:['1-0','1-1','2-0','2-1','2-2','3-1','otro'].map((value) => ({ value, label:value })) },
];

export const mockPredictionEvents: PredictionEvent[] = [
  { id:'evt_champions', name:'Champions League · noche europea', description:'Predecí 5 mercados antes del pitazo inicial.', sport:'football', status:'active', closes_at:addDays(now,1).toISOString(), entry_cost:1000, grand_prize_amount:5000, participants_count:1847, pool_accumulated:1840000, items:[
    { id:'champ_1', position:1, name:'Real Madrid vs Barcelona', market:'result_1x2', prize_amount:150 },
    { id:'champ_2', position:2, name:'PSG vs Bayern', market:'total_goals', prize_amount:120 },
    { id:'champ_3', position:3, name:'Inter vs City', market:'both_score', prize_amount:110 },
    { id:'champ_4', position:4, name:'Arsenal vs Milan', market:'total_corners', prize_amount:90 },
    { id:'champ_5', position:5, name:'Benfica vs Ajax', market:'exact_score', prize_amount:220 },
  ] },
  { id:'evt_atp', name:'ATP Madrid · semifinales', description:'Cuatro picks rápidos de tenis.', sport:'tennis', status:'active', closes_at:addDays(now,3).toISOString(), entry_cost:500, grand_prize_amount:2500, participants_count:612, pool_accumulated:306000, items:[
    { id:'atp_1', position:1, name:'Sinner vs Alcaraz', market:'winner_2options', prize_amount:100 },
    { id:'atp_2', position:2, name:'Zverev vs Ruud', market:'winner_2options', prize_amount:100 },
    { id:'atp_3', position:3, name:'Total games final', market:'total_goals', prize_amount:80 },
    { id:'atp_4', position:4, name:'Campeón del torneo', market:'winner_2options', prize_amount:120 },
  ] },
  { id:'evt_nba', name:'NBA Conference Finals', description:'Tres predicciones para la final de conferencia.', sport:'basketball', status:'past', closes_at:addDays(now,-2).toISOString(), entry_cost:750, grand_prize_amount:3000, participants_count:1020, pool_accumulated:765000, items:[
    { id:'nba_1', position:1, name:'Celtics vs Knicks', market:'winner_2options', prize_amount:120, player_prediction:'option1', result:'option1' },
    { id:'nba_2', position:2, name:'Total puntos', market:'total_goals', prize_amount:90, player_prediction:'over', result:'under' },
    { id:'nba_3', position:3, name:'MVP del partido', market:'winner_2options', prize_amount:150, player_prediction:'option2', result:'option2' },
  ] },
  { id:'evt_ufc', name:'UFC 305', description:'Cartelera principal con premio pleno.', sport:'ufc', status:'active', closes_at:addDays(now,2).toISOString(), entry_cost:1000, grand_prize_amount:5000, participants_count:999, pool_accumulated:999000, items:[
    { id:'ufc_1', position:1, name:'Main event', market:'winner_2options', prize_amount:200, player_prediction:'option1' },
    { id:'ufc_2', position:2, name:'Co-main event', market:'winner_2options', prize_amount:180, player_prediction:'option2' },
    { id:'ufc_3', position:3, name:'Pelea 3', market:'winner_2options', prize_amount:120, player_prediction:'option1' },
    { id:'ufc_4', position:4, name:'Pelea 4', market:'winner_2options', prize_amount:120, player_prediction:'option2' },
  ] },
];

export const mockAchievements: Achievement[] = [
  { id:'ach_racha_10', name:'Racha 10 dias', description:'Mantuviste actividad 10 dias seguidos.', tier:'bronze', status:'unlocked', icon:'🔥', reward:{xp:500,coins:100}, progress:{current:10,total:10}, unlocked_at:addDays(now,-8).toISOString() },
  { id:'ach_tipster', name:'Tipster preciso', description:'Acertá 10 predicciones deportivas.', tier:'silver', status:'in_progress', icon:'🎯', reward:{xp:1200,coins:350}, progress:{current:7,total:10} },
  { id:'ach_casino_gold', name:'Maestro casino', description:'Completá 50 misiones de casino.', tier:'gold', status:'in_progress', icon:'🎰', reward:{xp:2500,coins:800}, progress:{current:32,total:50} },
  { id:'ach_platinum_whale', name:'Leyenda de torneos', description:'Terminá top 3 en 5 torneos.', tier:'platinum', status:'locked', icon:'🏆', reward:{xp:5000,coins:1500}, progress:{current:1,total:5} },
  { id:'ach_secret', name:'Logro secreto', description:'?????', tier:'diamond', status:'secret', icon:'?', reward:{xp:10000,coins:5000,chest_id:'chest_legendary'}, hint:'Probá una combinación perfecta de predicciones.' },
];

export const mockShopItems: ShopItem[] = [
  {
    id: 'shop-001',
    name: 'Caja misteriosa premium',
    description: 'Puede contener XP, monedas o bonos del operador.',
    category: 'gamification',
    cost: 450,
    stock: null,
    lowStockThreshold: 10,
    vipRequired: null,
    endsAt: null,
    icon: 'box',
    featured: true,
  },
  {
    id: 'shop-002',
    name: '25 free spins',
    description: 'Validos en slots seleccionados por el operador.',
    category: 'operatorBonus',
    cost: 1200,
    stock: 8,
    lowStockThreshold: 10,
    vipRequired: null,
    endsAt: null,
    icon: 'sparkles',
    featured: true,
  },
  {
    id: 'shop-003',
    name: 'Cofre relampago x2',
    description: 'Promo de tiempo limitado con premios instantaneos.',
    category: 'gamification',
    cost: 800,
    stock: 22,
    lowStockThreshold: 8,
    vipRequired: 'gold',
    endsAt: addDays(now, 0.17).toISOString(),
    icon: 'zap',
  },
  {
    id: 'shop-004',
    name: 'Hoodie edicion liga oro',
    description: 'Producto fisico para jugadores VIP.',
    category: 'physical',
    cost: 3600,
    stock: 0,
    lowStockThreshold: 10,
    vipRequired: 'diamond',
    endsAt: null,
    icon: 'shirt',
  },
  {
    id: 'shop-005',
    name: 'Bono casino VIP silver',
    description: 'Bono exclusivo para tiers silver o superiores.',
    category: 'operatorBonus',
    cost: 1800,
    stock: 40,
    lowStockThreshold: 10,
    vipRequired: 'silver',
    endsAt: addDays(now, 3).toISOString(),
    icon: 'sparkles',
  },
];

export const mockRanking: PublicPlayer[] = [
  { id: 'rank-001', name: 'Sofia R.', username: 'sofiwins', avatar: 'SR', level: 31, vipTier: 'diamond', weeklyXP: 9820, position: 1 },
  { id: 'rank-002', name: 'Max Power', username: 'maxp', avatar: 'MP', level: 28, vipTier: 'gold', weeklyXP: 8740, position: 2 },
  { id: 'rank-003', name: 'Anonimo', username: 'anon-314', avatar: '??', level: 24, vipTier: 'silver', weeklyXP: 7120, position: 3, isAnonymous: true },
  { id: 'rank-004', name: 'Lau Data', username: 'laudata', avatar: 'LD', level: 22, vipTier: 'bronze', weeklyXP: 6900, position: 4 },
  { id: 'rank-005', name: 'Juan Martinez', username: 'juanm', avatar: 'JM', level: 20, vipTier: 'gold', weeklyXP: 6420, position: 5, isSelf: true },
  { id: 'rank-019', name: 'Nico Norte', username: 'nicon', avatar: 'NN', level: 18, vipTier: 'none', weeklyXP: 3440, position: 19 },
];

const badgeRot = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop',
];

const leaderboardEntries = (base: number): LeaderboardEntry[] =>
  Array.from({ length: 20 }, (_, index) => ({
    position: index + 1,
    handle: ['tigre_loco_82', 'maria_apuestas', 'sofiwins', 'crypto_king_88', 'juanm'][index % 5] + (index > 4 ? `_${index}` : ''),
    avatar: ['TL', 'MA', 'SW', 'CK', 'JM'][index % 5],
    metric_value: base - index * 8420,
    verified: index % 4 === 0,
    vip_tier: index < 2 ? 'diamond' : index < 7 ? 'gold' : index < 14 ? 'silver' : 'bronze',
    prize: index === 0 ? 100000 : index < 3 ? 50000 : index < 10 ? 10000 : index < 20 ? 5000 : undefined,
    is_self: index === 11,
    level_badge_url: badgeRot[index % badgeRot.length],
  }));

export const mockPlayerRankings: PlayerRankingSummary[] = [
  {
    ranking_id: 'best_xp',
    ranking_name: 'Mejores en XP',
    ranking_icon: '⭐',
    active: true,
    display_order: 1,
    player_position: 12,
    player_metric_value: 6420,
    player_change: 3,
    player_potential_prize: 5000,
    total_participants: 13064,
    closes_at: addDays(now, 20).toISOString(),
    window: 'monthly',
    metric_label: 'XP del mes',
    top_5: leaderboardEntries(1847220).slice(0, 5),
  },
  {
    ranking_id: 'best_casino',
    ranking_name: 'Mejores en Casino',
    ranking_icon: '🎰',
    active: true,
    display_order: 2,
    player_position: 38,
    player_metric_value: 420000,
    player_change: -1,
    player_potential_prize: 0,
    total_participants: 8742,
    closes_at: addDays(now, 20).toISOString(),
    window: 'monthly',
    metric_label: 'monto apostado',
    top_5: leaderboardEntries(920000).slice(0, 5),
  },
  {
    ranking_id: 'best_sports',
    ranking_name: 'Mejores en Deportes',
    ranking_icon: '⚽',
    active: true,
    display_order: 3,
    player_position: 8,
    player_metric_value: 310000,
    player_change: 0,
    player_potential_prize: 10000,
    total_participants: 4312,
    closes_at: addDays(now, 6).toISOString(),
    window: 'weekly',
    metric_label: 'monto apostado',
    top_5: leaderboardEntries(680000).slice(0, 5),
  },
  {
    ranking_id: 'best_depositors',
    ranking_name: 'Mejores depositadores',
    ranking_icon: '💳',
    active: true,
    display_order: 4,
    player_position: 104,
    player_metric_value: 120000,
    player_change: 4,
    player_potential_prize: 0,
    total_participants: 2401,
    closes_at: addDays(now, 20).toISOString(),
    window: 'monthly',
    metric_label: 'depósitos',
    top_5: leaderboardEntries(510000).slice(0, 5),
  },
];

export const mockLeaderboards: Record<string, LeaderboardFull> = Object.fromEntries(
  mockPlayerRankings.map((ranking) => [
    ranking.ranking_id,
    {
      ranking_id: ranking.ranking_id,
      entries: leaderboardEntries(ranking.player_metric_value * 12).map((entry) =>
        entry.position === 12 ? { ...entry, handle: mockPlayer.username, avatar: mockPlayer.avatar, is_self: true } : entry,
      ),
      player_position: ranking.player_position,
      closes_at: ranking.closes_at,
    },
  ]),
) as Record<string, LeaderboardFull>;

export const mockTournaments: Tournament[] = [
  {
    id: 'tour-001',
    name: 'Liga Champions Weekend',
    description: 'Competi por XP durante los partidos del fin de semana.',
    status: 'live',
    endsIn: '2 dias',
    participants: 842,
    capacity: 1000,
    prizePool: '$8,000',
    myPosition: 37,
    xp: 1840,
  },
  {
    id: 'tour-002',
    name: 'Sprint Slots Nocturno',
    description: 'Inscripciones abiertas para una ventana competitiva corta.',
    status: 'open',
    startsIn: 'manana',
    participants: 421,
    capacity: 500,
    prizePool: '$3,500',
  },
  {
    id: 'tour-003',
    name: 'Mesa Alta VIP',
    description: 'Evento reservado para jugadores plata o superior.',
    status: 'vip',
    startsIn: '4 dias',
    participants: 88,
    capacity: 120,
    prizePool: '$12,000',
    vipRequired: 'plata',
  },
];

export const mockPosts: FeedPost[] = [
  {
    id: 'post-001',
    authorName: 'Max Power',
    authorAvatar: 'MP',
    vipTier: 'gold',
    level: 28,
    body: 'Me gusta el over en el partido de hoy. Sin montos, solo lectura del momentum.',
    createdAt: subHours(now, 2).toISOString(),
    likes: 42,
    comments: 8,
    sharedPick: {
      teams: 'River vs Palmeiras',
      prediction: 'Over 2.5 goles',
      odds: 1.86,
      status: 'pendiente',
    },
  },
  {
    id: 'post-002',
    authorName: 'Sofia R.',
    authorAvatar: 'SR',
    vipTier: 'diamond',
    level: 31,
    body: 'Prediccion acertada y racha extendida. La paciencia pago.',
    createdAt: subHours(now, 5).toISOString(),
    likes: 128,
    comments: 19,
    accuratePrediction: {
      detail: 'Marcador exacto Napoli 2-1',
      xp: 220,
    },
  },
];

export const mockNews: NewsItem[] = [
  {
    id: 'news-001',
    category: 'promo',
    title: 'Free spins para liga oro',
    body: 'Reclama el pack semanal antes del cierre del domingo.',
    createdAt: subHours(now, 3).toISOString(),
    expiresAt: addDays(now, 2).toISOString(),
    ctaLabel: 'ver promo',
  },
  {
    id: 'news-002',
    category: 'sistema',
    title: 'Mejoras en ranking semanal',
    body: 'Ahora las zonas de ascenso y descenso se actualizan en tiempo real.',
    createdAt: subHours(now, 18).toISOString(),
  },
  {
    id: 'news-003',
    category: 'evento',
    title: 'Torneo relampago este viernes',
    body: 'Cupos limitados y premios para el top 20.',
    createdAt: addDays(now, -2).toISOString(),
    ctaLabel: 'inscribirme',
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'Premio pendiente',
    detail: 'Tu caja misteriosa vence pronto.',
    createdAt: subHours(now, 1).toISOString(),
    read: false,
    kind: 'reward',
  },
  {
    id: 'notif-002',
    title: 'Subiste al top 5',
    detail: 'Estas en zona de ascenso de liga oro.',
    createdAt: subHours(now, 4).toISOString(),
    read: false,
    kind: 'tournament',
  },
  {
    id: 'notif-003',
    title: 'Sofia R. comento tu post',
    detail: 'Buen analisis del partido.',
    createdAt: subHours(now, 27).toISOString(),
    read: true,
    kind: 'social',
  },
  {
    id: 'notif-boost-start',
    title: '🚀 ¡XP x2 activado!',
    detail: 'vence en 2 días',
    createdAt: subHours(now, 1).toISOString(),
    read: false,
    kind: 'system_event',
  },
  {
    id: 'notif-boost-end',
    title: 'Se terminó el x2',
    detail: 'tu XP volvió al ritmo normal · ¡seguí ganando!',
    createdAt: subHours(now, 30).toISOString(),
    read: true,
    kind: 'system_event',
  },
];

export const mockPendingPrizes: ProfilePrize[] = [
  {
    id: 'prize-001',
    kind: 'mysteryBox',
    label: 'Caja misteriosa premium',
    value: 1,
    expiresAt: addDays(now, 1).toISOString(),
    urgent: true,
  },
  {
    id: 'prize-002',
    kind: 'freeSpin',
    label: '25 free spins',
    value: 25,
    expiresAt: addDays(now, 3).toISOString(),
  },
  {
    id: 'prize-003',
    kind: 'coins',
    label: 'Bono de 300 monedas',
    value: 300,
    expiresAt: addDays(now, 5).toISOString(),
  },
];
