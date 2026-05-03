import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, eyebrow, description, action, actionLabel, onAction }: SectionHeaderProps) {
  const finalActionLabel = actionLabel ?? action;

  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">{eyebrow}</p> : null}
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {description ? <p className="mt-1 text-xs text-text-tertiary">{description}</p> : null}
      </div>
      {finalActionLabel ? (
        <Button
          aria-label={finalActionLabel}
          className="h-auto px-0 text-xs font-semibold text-accent hover:bg-transparent"
          disabled={!onAction}
          onClick={onAction}
          rightIcon={<ChevronRight className="h-3 w-3" />}
          size="sm"
          variant="ghost"
        >
          {finalActionLabel}
        </Button>
      ) : null}
    </div>
  );
}
