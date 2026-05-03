import { Card } from '../ui/Card';

export function AppearanceSection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold">apariencia</h2>
      {['modo oscuro permanente', 'sonidos de recompensas', 'animaciones reducidas', 'tamano de texto compacto'].map((item) => (
        <label key={item} className="flex items-center justify-between rounded-md bg-bg-tertiary p-3 text-sm">
          {item}
          <input type="checkbox" className="accent-accent" defaultChecked={item !== 'animaciones reducidas'} />
        </label>
      ))}
    </Card>
  );
}
