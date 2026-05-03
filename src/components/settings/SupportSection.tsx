import { Card } from '../ui/Card';

export function SupportSection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold">Soporte tecnico</h2>
      {['FAQ', 'reportar bug', 'terminos y condiciones', 'politica de privacidad'].map((item) => (
        <button
          key={item}
          type="button"
          className="flex w-full items-center justify-between rounded-md bg-bg-tertiary px-3 py-2 text-left text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <span>{item}</span>
          <span aria-hidden="true">-&gt;</span>
        </button>
      ))}
    </Card>
  );
}
