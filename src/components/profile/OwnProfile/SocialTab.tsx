import { Users } from 'lucide-react';

import { Card } from '../../ui/Card';
import { EmptyState } from '../../ui/EmptyState';

export function SocialTab() {
  return (
    <Card className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        {['184 seguidores', '72 siguiendo', '3 bloqueados'].map((item) => (
          <div key={item} className="rounded-md bg-bg-tertiary p-3 text-sm font-medium">
            {item}
          </div>
        ))}
      </div>
      <EmptyState
        icon={<Users className="h-8 w-8" />}
        title="buscador social listo"
        description="cuando el backend este conectado vas a gestionar seguidores, siguiendo y bloqueados desde aca."
      />
    </Card>
  );
}
