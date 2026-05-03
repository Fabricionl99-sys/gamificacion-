import { Shield } from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useUiStore } from '../../store/uiStore';
import { AccountSection } from './AccountSection';
import { AppearanceSection } from './AppearanceSection';
import { NotificationsSection } from './NotificationsSection';
import { PrivacySection } from './PrivacySection';
import { SupportSection } from './SupportSection';

export default function SettingsScreen() {
  const setActiveView = useUiStore((state) => state.setActiveView);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setActiveView('widget')}>
          volver
        </Button>
        <h1 className="text-lg font-semibold text-text-primary">configuracion de gamificacion</h1>
      </div>
      <Card className="border-info/30 bg-info/10">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 shrink-0 text-info" />
          <p className="text-sm text-text-secondary">
            Aca configuras como se ve tu experiencia. Todo lo de cuenta de juego se gestiona desde la plataforma del
            operador.
          </p>
        </div>
      </Card>
      <AccountSection />
      <NotificationsSection />
      <PrivacySection />
      <AppearanceSection />
      <SupportSection />
      <Card>
        <Button variant="ghost" className="w-full justify-between">
          ir a la plataforma del operador
        </Button>
      </Card>
      <p className="pb-4 text-center text-xs text-text-tertiary">widget de gamificacion · v1.0.0 · powered by tu marca</p>
    </div>
  );
}
