export interface PlayerInAppNotification {
  id: string;
  trigger_event: string;
  title: string;
  body: string;
  icon: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  created_at: string;
  opened: boolean;
}
