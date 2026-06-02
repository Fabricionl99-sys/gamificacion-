import {
  Bell,
  Box,
  Flame,
  Gift,
  Home,
  Megaphone,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  Trophy,
  User,
  UserCircle2,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId, WidgetTabConfig } from '../../types/navigation';

interface TabIcon {
  icon: LucideIcon;
}

const tabIcons: Record<TabId, TabIcon> = {
  home: { icon: Home },
  missions: { icon: Zap },
  streak: { icon: Flame },
  rewards: { icon: Box },
  shop: { icon: ShoppingBag },
  raffles: { icon: Gift },
  predictions: { icon: Package },
  tournaments: { icon: Sparkles },
  ranking: { icon: Trophy },
  news: { icon: Megaphone },
  avatars: { icon: UserCircle2 },
  profile: { icon: User },
  social: { icon: MessageCircle },
};

/** Orden sugerido demo v1.0.6 — filtrado dinámico en useWidgetVisibleTabs. */
export const widgetTabs: WidgetTabConfig[] = [
  { id: 'home', label: 'Inicio', shortLabel: 'inicio' },
  { id: 'missions', label: 'Misiones', shortLabel: 'misiones' },
  { id: 'streak', label: 'Asistencia', shortLabel: 'asistencia' },
  { id: 'rewards', label: 'Cofres', shortLabel: 'cofres' },
  { id: 'shop', label: 'Tienda', shortLabel: 'tienda' },
  { id: 'raffles', label: 'Sorteos', shortLabel: 'sorteos' },
  { id: 'predictions', label: 'Predicciones', shortLabel: 'predicciones' },
  { id: 'tournaments', label: 'Torneos', shortLabel: 'torneos' },
  { id: 'ranking', label: 'Ranking', shortLabel: 'ranking' },
  { id: 'news', label: 'Noticias', shortLabel: 'noticias' },
  { id: 'avatars', label: 'Avatares', shortLabel: 'avatares' },
  { id: 'profile', label: 'Mi Perfil', shortLabel: 'perfil' },
  { id: 'social', label: 'Social', shortLabel: 'social' },
];

/** @deprecated use useWidgetVisibleTabs */
export const tabs = widgetTabs;

export const getTabIcon = (tabId: TabId): LucideIcon => tabIcons[tabId]?.icon ?? Bell;
