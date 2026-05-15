import { Card } from '../ui/Card';

const CHANNELS = ['misiones completadas', 'premios pendientes', 'actividad social', 'torneos', 'noticias'] as const;

export function NotificationsSection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold text-text-primary">notificaciones</h2>
      {CHANNELS.map((item) => (
        <label key={item} className="flex items-center justify-between rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
          {item}
          <input type="checkbox" className="accent-accent" defaultChecked />
        </label>
      ))}
    </Card>
  );
}
