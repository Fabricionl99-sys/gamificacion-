import { Lock } from 'lucide-react';

import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProfileShell } from './ProfileShell';

export default function PrivateProfile() {
  return (
    <ProfileShell title="perfil privado">
      <Card variant="glass" className="text-center">
        <div className="relative mx-auto mb-4 h-20 w-20">
          <Avatar initials="LV" size="lg" className="h-20 w-20 text-lg" />
          <div className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-bg-elevated text-text-secondary">
            <Lock className="h-4 w-4" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-text-primary">Luna Vegas</h1>
        <p className="text-sm text-text-tertiary">@lunav · nivel 18</p>
        <Button variant="primary" className="mt-4 w-full">
          solicitar seguir
        </Button>
      </Card>
      <Card className="grid min-h-48 place-items-center text-center">
        <div>
          <Lock className="mx-auto mb-3 h-8 w-8 text-text-tertiary" />
          <p className="font-semibold text-text-primary">este perfil es privado</p>
          <p className="mt-1 text-sm text-text-secondary">solo seguidores aprobados ven posts y predicciones.</p>
        </div>
      </Card>
    </ProfileShell>
  );
}
