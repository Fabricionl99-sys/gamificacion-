import {
  Bell,
  Award,
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
  achievements: { icon: Award },
  shop: { icon: ShoppingBag },
  streak: { icon: Flame },
  ranking: { icon: Trophy },
  tournaments: { icon: Sparkles },
  predictions: { icon: Package },
  feed: { icon: MessageCircle },
  news: { icon: Megaphone },
};

export const tabs: WidgetTabConfig[] = [
  { id: 'home', label: 'Inicio', shortLabel: 'inicio' },
  { id: 'missions', label: 'Misiones', shortLabel: 'misiones' },
  { id: 'achievements', label: 'Logros', shortLabel: 'logros' },
  { id: 'shop', label: 'Tienda', shortLabel: 'tienda' },
  { id: 'streak', label: 'Asistencia/Racha', shortLabel: 'racha' },
  { id: 'ranking', label: 'Ranking', shortLabel: 'ranking' },
  { id: 'tournaments', label: 'Torneos', shortLabel: 'torneos' },
  { id: 'predictions', label: 'Predicciones', shortLabel: 'predice' },
  { id: 'feed', label: 'Feed', shortLabel: 'feed' },
  { id: 'news', label: 'Noticias', shortLabel: 'noticias' },
];

export const visibleTabs = tabs.filter((tab) => tab.id !== 'feed' || FEATURES.feed_enabled);

export const getTabIcon = (tabId: TabId): LucideIcon => tabIcons[tabId]?.icon ?? Bell;
