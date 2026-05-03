import { Clock, Gift } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import { mockPendingPrizes } from '../../../mocks';

export function PendingPrizesTab() {
  return (
    <div className="space-y-3">
      {mockPendingPrizes.map((prize) => (
        <Card
          key={prize.id}
          className={prize.urgent ? 'border-danger/60 bg-danger/10' : undefined}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-bg-tertiary text-coins">
              <Gift className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{prize.label}</p>
                {prize.urgent ? <Badge variant="danger">vence pronto</Badge> : null}
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-text-tertiary">
                <Clock className="h-3 w-3" /> expira pronto
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
