export type WidgetTabId =
  | 'home'
  | 'missions'
  | 'achievements'
  | 'shop'
  | 'streak'
  | 'ranking'
  | 'tournaments'
  | 'predictions'
  | 'feed'
  | 'news';

export type TabId = WidgetTabId;

export interface WidgetTabConfig {
  id: WidgetTabId;
  label: string;
  shortLabel: string;
}
