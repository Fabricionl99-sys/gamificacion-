import { useMemo, useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

import { AccountSection } from '../../settings/AccountSection';
import { AppearanceSection } from '../../settings/AppearanceSection';
import { NotificationsSection } from '../../settings/NotificationsSection';
import { OperatorPlatformCard, SupportSection } from '../../settings/SupportSection';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Modal } from '../../ui/Modal';
import { Tabs } from '../../ui/Tabs';
import { usePlayer } from '../../../hooks/usePlayer';
import { useAsyncData } from '../../../hooks/useAsyncData';
import { getAvatars } from '../../../api/avatars';
import { usePlayerStore } from '../../../store/playerStore';
import { useWidgetNavigation } from '../../../hooks/useWidgetNavigation';
import { getAvatarBackgroundFromName } from '../../../utils/avatarHashColor';
import HistoryTab from './HistoryTab';
import { PendingPrizesTab } from './PendingPrizesTab';
import { SocialTab } from './SocialTab';
import { SummaryTab } from './SummaryTab';

type OwnProfileTab = 'summary' | 'prizes' | 'history' | 'social';

const isOwnProfileTab = (tab: string): tab is OwnProfileTab =>
  ['summary', 'prizes', 'history', 'social'].includes(tab);

export default function OwnProfile() {
  const [activeTab, setActiveTab] = useState<OwnProfileTab>('summary');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const { navigateBackFromProfile } = useWidgetNavigation();
  const { player } = usePlayer();
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const { data: avatars = [] } = useAsyncData(getAvatars, []);

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
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3 w-3" />} onClick={() => navigateBackFromProfile()}>
          volver
        </Button>
        <h1 className="text-lg font-semibold text-text-primary">Mi perfil</h1>
        <span className="w-14" aria-hidden />
      </div>

      <Card className="border-info/30 bg-info/10">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 shrink-0 text-info" />
          <p className="text-sm text-text-secondary">
            Datos de cuenta sensibles los gestiona el operador. Desde acá ajustás preferencias del widget, avisos y
            apariencia.
          </p>
        </div>
      </Card>

      <div className="card-glass rounded-xl p-4">
        <div className="flex items-start gap-4">
          <button
            type="button"
            className="shrink-0 rounded-full transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Elegir avatar"
            onClick={() => setAvatarPickerOpen(true)}
          >
            <Avatar initials={player.avatar} size="lg" status="online" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-text-primary">{player.name}</h2>
              <Badge variant="warning">VIP {player.vipTier}</Badge>
            </div>
            <p className="text-sm text-text-tertiary">@{player.username}</p>
            <p className="mt-2 text-sm text-text-secondary">{player.bio}</p>
          </div>
        </div>
      </div>

      <AccountSection onOpenAvatarPicker={() => setAvatarPickerOpen(true)} />
      <NotificationsSection />
      <AppearanceSection />
      <SupportSection />
      <OperatorPlatformCard />

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

      <p className="pb-2 text-center text-metadata text-text-tertiary">widget de gamificacion · v1.0.0</p>

      <Modal isOpen={avatarPickerOpen} title="Elegí tu avatar" onClose={() => setAvatarPickerOpen(false)}>
        {avatars.length === 0 ? (
          <p className="text-sm text-text-secondary">El operador no configuró avatares todavía.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                className="flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border border-border-default transition hover:border-accent"
                style={
                  avatar.image_url
                    ? { backgroundImage: `url(${avatar.image_url})`, backgroundSize: 'cover' }
                    : {
                        background: getAvatarBackgroundFromName(avatar.code),
                        boxShadow: '0 0 0 1px rgba(10, 247, 132, 0.2)',
                      }
                }
                onClick={() => {
                  updatePlayer({ avatar: avatar.code });
                  setAvatarPickerOpen(false);
                }}
              >
                {!avatar.image_url ? (
                  <span className="font-mono text-lg font-bold text-white">{avatar.code.slice(0, 2).toUpperCase()}</span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
