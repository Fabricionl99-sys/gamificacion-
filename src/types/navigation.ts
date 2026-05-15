export type WidgetTabId =
  | 'home'
  | 'missions'
  | 'shop'
  | 'social'
  | 'streak'
  | 'ranking'
  | 'tournaments'
  | 'predictions'
  | 'news';

export type TabId = WidgetTabId;

export interface WidgetTabConfig {
  id: WidgetTabId;
  label: string;
  shortLabel: string;
}
