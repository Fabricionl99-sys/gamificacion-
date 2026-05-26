import { Trophy } from 'lucide-react';

import { Button } from '../../ui/Button';
import type { WheelSegmentDisplay } from '../../../lib/wheelDisplay';

interface WheelResultViewProps {
  prize: WheelSegmentDisplay;
  onCollect: () => void;
}

export function ResultView({ prize, onCollect }: WheelResultViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-accent-subtle text-accent shadow-glow">
        {prize.imageUrl ? (
          <img src={prize.imageUrl} alt="" className="h-14 w-14 object-contain" />
        ) : (
          <Trophy className="h-9 w-9" />
        )}
      </div>
      <div>
        <p className="text-sm text-text-secondary">premio ganado</p>
        <p className="mt-1 text-2xl font-semibold text-accent">{prize.name}</p>
      </div>
      <Button variant="primary" className="w-full" onClick={onCollect}>
        apreta para recoger
      </Button>
    </div>
  );
}
