import { Trophy } from 'lucide-react';

import { Button } from '../../ui/Button';

interface WheelResultViewProps {
  onCollect: () => void;
}

export function ResultView({ onCollect }: WheelResultViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-subtle text-accent shadow-glow">
        <Trophy className="h-9 w-9" />
      </div>
      <div>
        <p className="text-sm text-text-secondary">premio ganado</p>
        <p className="mt-1 text-2xl font-semibold text-accent">+250 XP</p>
      </div>
      <Button variant="primary" className="w-full" onClick={onCollect}>
        apreta para recoger
      </Button>
    </div>
  );
}
