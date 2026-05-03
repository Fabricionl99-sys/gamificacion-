import { Gift } from 'lucide-react';

import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface PreOpenViewProps {
  onOpen: () => void;
}

export function PreOpenView({ onOpen }: PreOpenViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-32 w-32 place-items-center rounded-xl bg-gradient-to-br from-coins to-warning shadow-card">
        <Gift className="h-16 w-16 text-bg-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-text-primary">Caja misteriosa premium</h3>
        <p className="mt-1 text-sm font-light italic text-text-secondary">que te tocara hoy?</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['XP bonus', 'free spins', 'monedas', 'multiplicador'].map((reward) => (
          <Badge key={reward} variant="neutral">
            {reward}
          </Badge>
        ))}
      </div>
      <Button variant="primary" className="w-full" onClick={onOpen}>
        abrir caja
      </Button>
    </div>
  );
}
