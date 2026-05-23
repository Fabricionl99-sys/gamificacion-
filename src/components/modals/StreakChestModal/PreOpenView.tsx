import { Flame, Lock, Unlock } from 'lucide-react';

import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface PreOpenViewProps {
  onOpen: () => void;
}

export function PreOpenView({ onOpen }: PreOpenViewProps) {
  return (
    <div className="space-y-4 text-center">
      <Card className="bg-[radial-gradient(circle_at_top,var(--warning-glow),var(--bg-secondary))]">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-lg border border-warning/30 bg-warning/10">
          <Unlock className="h-10 w-10 text-warning" />
        </div>
        <p className="text-metadata font-semibold uppercase tracking-widest text-warning">12 dias seguidos</p>
        <h3 className="mt-2 text-xl font-semibold text-text-primary">Lo lograste</h3>
        <p className="mt-1 text-sm text-text-secondary">Tu cofre de racha esta listo para abrir.</p>
      </Card>
      <div className="grid grid-cols-3 gap-2">
        {[7, 14, 100].map((day) => (
          <div key={day} className="rounded-md border border-border-default bg-bg-tertiary p-3">
            <Lock className="mx-auto h-4 w-4 text-text-tertiary" />
            <p className="mt-1 text-metadata text-text-secondary">{day} dias</p>
          </div>
        ))}
      </div>
      <Button variant="primary" className="w-full" onClick={onOpen} leftIcon={<Flame className="h-4 w-4" />}>
        abrir cofre
      </Button>
    </div>
  );
}
