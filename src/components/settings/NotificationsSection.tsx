import { Card } from '../ui/Card';

export function NotificationsSection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold text-text-primary">notificaciones</h2>
      {['misiones completadas', 'premios pendientes', 'actividad social', 'torneos'].map((item) => (
        <label key={item} className="flex items-center justify-between rounded-md bg-bg-tertiary p-3 text-sm">
          {item}
          <input type="checkbox" className="accent-accent" defaultChecked />
        </label>
      ))}
    </Card>
  );
}
