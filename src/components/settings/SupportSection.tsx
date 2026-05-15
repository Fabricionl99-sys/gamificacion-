import { ExternalLink, LifeBuoy } from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/** Placeholder: abrir canal de soporte del operador. */
function handleContactSupport(): void {
  /* intentionally empty */
}

const LINKS = ['Como funciona el widget', 'Preguntas frecuentes', 'Términos y condiciones', 'Política de privacidad'] as const;

export function SupportSection() {
  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold text-text-primary">soporte técnico</h2>
      <p className="text-sm leading-relaxed text-text-secondary">
        Acá vas a encontrar guías breves del sistema y enlaces útiles. Cuando el operador conecte su centro de ayuda, estos
        botones abrirán la documentación o el contacto oficial.
      </p>
      <Button type="button" variant="secondary" className="w-full gap-2" leftIcon={<LifeBuoy className="h-4 w-4" />} onClick={handleContactSupport}>
        contactar soporte
      </Button>
      {LINKS.map((item) => (
        <button
          key={item}
          type="button"
          className="flex w-full items-center justify-between rounded-md bg-bg-tertiary px-3 py-2 text-left text-sm font-medium text-text-secondary transition hover:text-text-primary"
        >
          <span>{item}</span>
          <span aria-hidden="true">→</span>
        </button>
      ))}
    </Card>
  );
}

export function OperatorPlatformCard() {
  /** Placeholder: URL vendrá del operador / branding API. */
  function handleGoOperator(): void {
    /* intentionally empty */
  }

  return (
    <Card className="p-0">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
        onClick={handleGoOperator}
      >
        <span>ir a la plataforma del operador</span>
        <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      </button>
    </Card>
  );
}
