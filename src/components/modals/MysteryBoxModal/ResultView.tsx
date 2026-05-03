import { Button } from '../../ui/Button';

interface ResultViewProps {
  onCollect: () => void;
}

export function ResultView({ onCollect }: ResultViewProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-32 w-32 place-items-center rounded-xl border border-accent/30 bg-accent-subtle shadow-glow">
        <div>
          <p className="text-3xl font-semibold text-accent">450</p>
          <p className="text-sm font-medium text-text-primary">monedas</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary">Premio liberado por server. La animacion solo revelo el resultado.</p>
      <Button className="w-full" onClick={onCollect} variant="primary">
        apreta para recoger
      </Button>
    </div>
  );
}
