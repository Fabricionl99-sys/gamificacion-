export type WidgetTabId =
  | 'home'
  | 'missions'
  | 'rewards'
  | 'shop'
  | 'social'
  | 'streak'
  | 'ranking'
  | 'tournaments'
  | 'predictions'
  | 'raffles'
  | 'news';

export type TabId = WidgetTabId;

export interface WidgetTabConfig {
  id: WidgetTabId;
  label: string;
  shortLabel: string;
}
