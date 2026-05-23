import type { ReactNode } from 'react';

import { Card } from './Card';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="items-center py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-border-default bg-bg-tertiary text-text-secondary">
        {icon}
      </div>
      <h3 className="text-md font-medium text-text-primary">{title}</h3>
      <p className="mt-2 max-w-60 text-module-body text-text-secondary">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
