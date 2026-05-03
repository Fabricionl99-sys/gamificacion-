import { Activity, Star } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

const events = [
  'Reclamo 50 XP por mision diaria',
  'Publico una fija compartida sin montos',
  'Entro al top 5 de liga oro',
];

export default function HistoryTab() {
  return (
    <div className="space-y-3">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-tertiary">rating tipster</p>
          <p className="text-2xl font-semibold text-text-primary">68%</p>
        </div>
        <Star className="h-6 w-6 text-coins" aria-hidden="true" />
      </Card>
      {events.map((event) => (
        <Card key={event} className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bg-tertiary text-text-secondary">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{event}</p>
            <p className="text-xs text-text-tertiary">hace unas horas</p>
          </div>
          <Badge variant="neutral">historial</Badge>
        </Card>
      ))}
    </div>
  );
}
