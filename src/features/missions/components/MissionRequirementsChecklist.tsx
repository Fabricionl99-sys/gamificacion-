import { Check, Square } from 'lucide-react';

import type { MissionRequirement } from '../../../types/mission';
import { formatNumber } from '../../../utils/format';

export function MissionRequirementsChecklist({
  requirements,
  title = 'Requisitos para completar',
}: {
  requirements: MissionRequirement[];
  title?: string;
}) {
  if (requirements.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">{title}</p>
      <ul className="space-y-1.5">
        {requirements.map((req) => (
          <li key={req.id} className="flex items-start gap-2 text-module-body">
            {req.isComplete ? (
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
            ) : (
              <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-tertiary" aria-hidden />
            )}
            <span className={req.isComplete ? 'text-success' : 'text-text-secondary'}>{req.label}</span>
            {req.showProgress ? (
              <span className="ml-auto shrink-0 text-[11px] tabular-nums text-text-tertiary">
                ({formatNumber(req.currentValue)} / {formatNumber(req.targetValue)})
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
