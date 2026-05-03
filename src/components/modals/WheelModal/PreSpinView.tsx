import { Button } from '../../ui/Button';

interface PreSpinViewProps {
  onSpin: () => void;
}

export function PreSpinView({ onSpin }: PreSpinViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full border border-border-accent bg-[conic-gradient(from_0deg,#13181F,#242C38,#FFB020,#13181F,#4D9FFF,#1E252F,#0AF784,#13181F)] shadow-card">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-bg-primary text-sm font-semibold text-text-primary">rueda</div>
        <div className="absolute -top-2 h-6 w-4 rounded-sm bg-accent shadow-glow" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Rueda de la fortuna</h3>
        <p className="mt-1 text-sm text-text-secondary">8 segmentos configurables por operador.</p>
      </div>
      <Button variant="primary" className="w-full" onClick={onSpin}>
        girar rueda
      </Button>
    </div>
  );
}
