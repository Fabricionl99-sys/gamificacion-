import type { TabId } from '../types/navigation';

export type WidgetDetailSection = 'sorteos' | 'predicciones' | 'tienda' | 'torneos';

export type WidgetView = 'widget' | 'own-profile' | 'player-profile';

export const TAB_PATHS: Record<TabId, string> = {
  home: '/',
  missions: '/misiones',
  rewards: '/cofres',
  shop: '/tienda',
  social: '/social',
  streak: '/racha',
  ranking: '/ranking',
  tournaments: '/torneos',
  predictions: '/predicciones',
  raffles: '/sorteos',
  news: '/noticias',
};

export const PROFILE_PATH = '/perfil';

const PATH_TO_TAB = new Map<string, TabId>(
  Object.entries(TAB_PATHS).map(([tabId, path]) => [path, tabId as TabId]),
);

const DETAIL_SECTION_TO_TAB: Record<WidgetDetailSection, TabId> = {
  sorteos: 'raffles',
  predicciones: 'predictions',
  tienda: 'shop',
  torneos: 'tournaments',
};

const TAB_TO_DETAIL_SECTION: Partial<Record<TabId, WidgetDetailSection>> = {
  raffles: 'sorteos',
  predictions: 'predicciones',
  shop: 'tienda',
  tournaments: 'torneos',
};

export interface ParsedWidgetRoute {
  tab: TabId;
  view: WidgetView;
  playerStateId?: string;
  detailId?: string;
  action?: string;
}

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

export function parseWidgetPath(pathname: string, search = ''): ParsedWidgetRoute {
  const path = normalizePath(pathname);
  const params = new URLSearchParams(search);
  const action = params.get('action') ?? undefined;

  if (path === PROFILE_PATH) {
    return { tab: 'home', view: 'own-profile', action };
  }

  const profilePrefix = `${PROFILE_PATH}/`;
  if (path.startsWith(profilePrefix)) {
    const playerStateId = decodeURIComponent(path.slice(profilePrefix.length));
    if (playerStateId) {
      return { tab: 'social', view: 'player-profile', playerStateId, action };
    }
  }

  for (const [section, tab] of Object.entries(DETAIL_SECTION_TO_TAB) as [WidgetDetailSection, TabId][]) {
    const prefix = `/${section}/`;
    if (path.startsWith(prefix)) {
      const detailId = decodeURIComponent(path.slice(prefix.length));
      if (detailId) {
        return { tab, view: 'widget', detailId, action };
      }
    }
  }

  const tab = PATH_TO_TAB.get(path);
  if (tab) {
    return { tab, view: 'widget', action };
  }

  return { tab: 'home', view: 'widget' };
}

export function buildTabPath(tab: TabId): string {
  return TAB_PATHS[tab];
}

export function buildProfilePath(): string {
  return PROFILE_PATH;
}

export function buildPlayerProfilePath(playerStateId: string): string {
  return `${PROFILE_PATH}/${encodeURIComponent(playerStateId)}`;
}

export function buildDetailPath(section: WidgetDetailSection, id: string, action?: string): string {
  const base = `/${section}/${encodeURIComponent(id)}`;
  if (!action) return base;
  return `${base}?action=${encodeURIComponent(action)}`;
}

export function detailSectionForTab(tab: TabId): WidgetDetailSection | undefined {
  return TAB_TO_DETAIL_SECTION[tab];
}
