import { Flame, Unlock } from 'lucide-react';

import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface PreOpenViewProps {
  title: string;
  description: string;
  onOpen: () => void;
}

export function PreOpenView({ title, description, onOpen }: PreOpenViewProps) {
  return (
    <div className="space-y-4 text-center">
      <Card className="bg-[radial-gradient(circle_at_top,var(--warning-glow),var(--bg-secondary))]">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-lg border border-warning/30 bg-warning/10">
          <Unlock className="h-10 w-10 text-warning" />
        </div>
        <h3 className="mt-2 text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </Card>
      <Button variant="primary" className="w-full" onClick={onOpen} leftIcon={<Flame className="h-4 w-4" />}>
        abrir cofre
      </Button>
    </div>
  );
}
