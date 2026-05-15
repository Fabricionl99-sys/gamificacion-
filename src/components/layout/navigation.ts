import {
  Bell,
  Flame,
  Home,
  Megaphone,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FEATURES } from '../../config/features';
import type { TabId, WidgetTabConfig } from '../../types/navigation';

interface TabIcon {
  icon: LucideIcon;
}

const tabIcons: Record<TabId, TabIcon> = {
  home: { icon: Home },
  missions: { icon: Zap },
  shop: { icon: ShoppingBag },
  social: { icon: MessageCircle },
  streak: { icon: Flame },
  ranking: { icon: Trophy },
  tournaments: { icon: Sparkles },
  predictions: { icon: Package },
  news: { icon: Megaphone },
};

/** Orden en barra lateral y móvil (scroll horizontal). */
export const tabs: WidgetTabConfig[] = [
  { id: 'home', label: 'Inicio', shortLabel: 'inicio' },
  { id: 'missions', label: 'Misiones', shortLabel: 'misiones' },
  { id: 'shop', label: 'Tienda', shortLabel: 'tienda' },
  { id: 'social', label: 'Social', shortLabel: 'social' },
  { id: 'streak', label: 'Asistencia/Racha', shortLabel: 'racha' },
  { id: 'ranking', label: 'Ranking', shortLabel: 'ranking' },
  { id: 'tournaments', label: 'Torneos', shortLabel: 'torneos' },
  { id: 'predictions', label: 'Predicciones', shortLabel: 'predicciones' },
  { id: 'news', label: 'Noticias', shortLabel: 'noticias' },
];

export const visibleTabs = tabs.filter((tab) => tab.id !== 'social' || FEATURES.social_enabled);

export const getTabIcon = (tabId: TabId): LucideIcon => tabIcons[tabId]?.icon ?? Bell;
