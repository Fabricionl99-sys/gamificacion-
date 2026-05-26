import { Button } from '../../ui/Button';
import type { WheelVisualConfig } from '../../../lib/wheelDisplay';
import { WheelDisc } from './WheelDisc';

interface PreSpinViewProps {
  config: WheelVisualConfig;
  onSpin: () => void;
}

export function PreSpinView({ config, onSpin }: PreSpinViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto w-fit">
        <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-accent" />
        <WheelDisc
          size="md"
          segments={config.segments}
          backgroundImageUrl={config.backgroundImageUrl}
          centerLogoUrl={config.centerLogoUrl}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Rueda de la fortuna</h3>
        <p className="mt-1 text-sm text-text-secondary">
          {config.segments.length} premios · logo central del operador
        </p>
      </div>
      <Button variant="primary" className="w-full" onClick={onSpin}>
        girar rueda
      </Button>
    </div>
  );
}
