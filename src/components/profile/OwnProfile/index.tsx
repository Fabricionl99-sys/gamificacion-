import { useMemo, useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';

import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Tabs } from '../../ui/Tabs';
import { mockPlayer } from '../../../mocks';
import { useUiStore } from '../../../store/uiStore';
import HistoryTab from './HistoryTab';
import { PendingPrizesTab } from './PendingPrizesTab';
import { SocialTab } from './SocialTab';
import { SummaryTab } from './SummaryTab';

type OwnProfileTab = 'summary' | 'prizes' | 'history' | 'social';

const isOwnProfileTab = (tab: string): tab is OwnProfileTab =>
  ['summary', 'prizes', 'history', 'social'].includes(tab);

export default function OwnProfile() {
  const [activeTab, setActiveTab] = useState<OwnProfileTab>('summary');
  const setActiveView = useUiStore((state) => state.setActiveView);

  const tabs = useMemo(
    (): Array<{ id: OwnProfileTab; label: string }> => [
      { id: 'summary', label: 'resumen' },
      { id: 'prizes', label: 'premios' },
      { id: 'history', label: 'historial' },
      { id: 'social', label: 'social' },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="card-glass rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3 w-3" />} onClick={() => setActiveView('widget')}>
            volver
          </Button>
          <Button variant="ghost" size="icon" aria-label="abrir configuracion" onClick={() => setActiveView('settings')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Avatar initials={mockPlayer.avatar} size="lg" status="online" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-text-primary">{mockPlayer.name}</h1>
              <Badge variant="warning">VIP {mockPlayer.vipTier}</Badge>
            </div>
            <p className="text-sm text-text-tertiary">@{mockPlayer.username}</p>
            <p className="mt-2 text-sm text-text-secondary">{mockPlayer.bio}</p>
          </div>
        </div>
      </div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => {
          if (isOwnProfileTab(tab)) {
            setActiveTab(tab);
          }
        }}
      />
      <div>
        {activeTab === 'summary' ? <SummaryTab /> : null}
        {activeTab === 'prizes' ? <PendingPrizesTab /> : null}
        {activeTab === 'history' ? <HistoryTab /> : null}
        {activeTab === 'social' ? <SocialTab /> : null}
      </div>
    </div>
  );
}
