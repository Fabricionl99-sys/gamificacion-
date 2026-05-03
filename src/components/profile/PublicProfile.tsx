import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { PostCard } from '../shared/PostCard';
import { mockPosts, mockRanking } from '../../mocks';
import { useUiStore } from '../../store/uiStore';
import { formatNumber } from '../../utils/format';

export default function PublicProfile() {
  const setActiveView = useUiStore((state) => state.setActiveView);
  const player = mockRanking[1] ?? mockRanking[0];

  if (!player) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => setActiveView('widget')}>
        volver
      </Button>
      <Card variant="glass" className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar initials={player.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{player.name}</h1>
              <Badge variant="warning">VIP {player.vipTier}</Badge>
            </div>
            <p className="text-sm text-text-tertiary">@{player.username} · nivel {player.level}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Perfil publico: se muestran stats deportivas, posts y predicciones visibles. Monedas, premios y racha permanecen privados.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['fijas', '184'],
            ['acierto', '61%'],
            ['seguidores', formatNumber(1280)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-bg-tertiary p-3 text-center">
              <p className="text-lg font-semibold">{value}</p>
              <p className="text-xs text-text-tertiary">{label}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-3">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
