import { Binary, Radar } from 'lucide-react';
import { Card } from '../ui/Card';

export default function PredictionsTab() {
  return (
    <div className="space-y-4">
      <Card variant="neon" className="scan-effect relative overflow-hidden p-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-border-accent bg-accent-subtle text-accent">
          <Radar className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">proximamente</p>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">Predicciones deportivas</h2>
        <p className="mt-2 text-sm text-text-secondary">
          estamos preparando el sistema de predicciones · te avisamos cuando este listo
        </p>
      </Card>
      <Card className="space-y-2 font-mono text-xs text-text-tertiary">
        <p className="flex items-center gap-2 text-text-secondary">
          <Binary className="h-4 w-4" aria-hidden="true" />
          loading_future_module()
        </p>
        <p>{'>'} oracle.sync.events = pending</p>
        <p>{'>'} xp.prediction.engine = warming_up</p>
        <p>{'>'} notify.player = true</p>
      </Card>
    </div>
  );
}
