export interface XPBoost {
  id: string;
  name: string;
  enabled: boolean;
  multiplier: 1.5 | 2 | 3 | 5;
  starts_at: string;
  ends_at: string;
  scope: 'all' | 'category';
  category_code?: import('./category').GameCategory;
  rule_id: string;
  rule_name: string;
}
