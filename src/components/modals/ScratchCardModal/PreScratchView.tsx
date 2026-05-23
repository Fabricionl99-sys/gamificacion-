import { Button } from '../../ui/Button';

interface PreScratchViewProps {
  onStart: () => void;
}

export function PreScratchView({ onStart }: PreScratchViewProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="grid grid-cols-3 gap-2">
        {['rascar', 'rascar', 'rascar'].map((label, index) => (
          <div key={`${label}-${index}`} className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-8 text-metadata font-semibold uppercase tracking-widest text-warning">
            {label}
          </div>
        ))}
      </div>
      <p className="text-sm text-text-secondary">3 iguales = ganas. Raspa al menos 70% para revelar completo.</p>
      <Button variant="primary" className="w-full" onClick={onStart}>
        empezar a raspar
      </Button>
    </div>
  );
}
