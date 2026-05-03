import { Card } from '../ui/Card';

export function PrivacySection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold">privacidad del feed</h2>
      <label className="flex items-center justify-between text-sm text-text-secondary">
        permitir comentarios de seguidores
        <input type="checkbox" defaultChecked className="accent-accent" />
      </label>
      <label className="flex items-center justify-between text-sm text-text-secondary">
        mostrar rating tipster
        <input type="checkbox" defaultChecked className="accent-accent" />
      </label>
      <label className="flex items-center justify-between text-sm text-text-secondary">
        anonimato en ranking
        <input type="checkbox" className="accent-accent" />
      </label>
    </Card>
  );
}
