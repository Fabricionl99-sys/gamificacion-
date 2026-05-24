import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useCursorList } from '../../hooks/useCursorList';
import { useSocialProfile } from '../../hooks/useSocialProfile';
import { useToast } from '../../hooks/useToast';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useUiStore } from '../../store/uiStore';
import type { SocialProfilePublic } from '../../types/socialModule';
import { parseSocialError } from '../../utils/socialErrors';
import { getPlayerInitials } from '../../utils/playerInitials';
import SocialPostCard from '../shared/SocialPostCard';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import ReportPostModal from '../modals/ReportPostModal';
import type { SocialPost } from '../../types/socialModule';

export default function PlayerPublicProfile() {
  const playerStateId = useUiStore((state) => state.playerStateId);
  const { navigateBackFromProfile, navigateToPlayerProfile } = useWidgetNavigation();
  const { profile: myProfile } = useSocialProfile();
  const toast = useToast();
  const [profile, setProfile] = useState<SocialProfilePublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [reportPost, setReportPost] = useState<SocialPost | null>(null);

  const loader = useCallback(
    (cursor?: string | null) => {
      if (!playerStateId) return Promise.resolve({ items: [], next_cursor: null });
      return socialApi.getPostsByAuthor(playerStateId, cursor);
    },
    [playerStateId],
  );

  const { items, isLoading: postsLoading, reset } = useCursorList(loader, [playerStateId, profile?.is_following]);

  const refreshProfile = useCallback(async () => {
    if (!playerStateId) return;
    setIsLoading(true);
    setNotAvailable(false);
    try {
      const data = await socialApi.getProfile(playerStateId);
      setProfile(data);
    } catch (error) {
      const parsed = parseSocialError(error);
      if (parsed.code === 'not_found') setNotAvailable(true);
      else toast.danger(parsed.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [playerStateId, toast]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const isSelf = myProfile?.player_state_id === playerStateId;

  const handleFollow = async () => {
    if (!playerStateId || followBusy) return;
    setFollowBusy(true);
    try {
      if (profile?.is_following) {
        await socialApi.unfollow(playerStateId);
        toast.success('Dejaste de seguir');
      } else {
        const result = await socialApi.follow(playerStateId);
        toast.success(result.status === 'pending' ? 'Solicitud enviada' : 'Ahora seguís a este jugador');
      }
      await refreshProfile();
      reset();
    } catch (error) {
      toast.danger(parseSocialError(error).message);
    } finally {
      setFollowBusy(false);
    }
  };

  if (!playerStateId) return null;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={navigateBackFromProfile}>
        Volver
      </Button>

      {isLoading ? (
        <Skeleton className="h-32" />
      ) : notAvailable ? (
        <Card className="p-4 text-center">
          <p className="text-sm font-semibold text-text-primary">Este perfil es privado</p>
          <p className="mt-1 text-module-body text-text-secondary">No podés ver su contenido.</p>
          {!isSelf ? (
            <Button className="mt-4" variant="primary" size="sm" isLoading={followBusy} onClick={handleFollow}>
              Solicitar follow
            </Button>
          ) : null}
        </Card>
      ) : profile ? (
        <>
          <Card className="flex items-start gap-4 p-4">
            <Avatar
              initials={getPlayerInitials(profile.display_name)}
              imageUrl={profile.avatar_url}
              size="lg"
              label={profile.display_name}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-md font-semibold text-text-primary">{profile.display_name}</h2>
              {profile.bio ? <p className="mt-1 text-module-body text-text-secondary">{profile.bio}</p> : null}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-semibold text-text-primary">{profile.follower_count}</p>
                  <p className="text-metadata text-text-tertiary">seguidores</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{profile.following_count}</p>
                  <p className="text-metadata text-text-tertiary">siguiendo</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{profile.post_count}</p>
                  <p className="text-metadata text-text-tertiary">posts</p>
                </div>
              </div>
              {!isSelf ? (
                <Button
                  className="mt-4 w-full"
                  variant={profile.is_following ? 'secondary' : 'primary'}
                  disabled={profile.follow_request_pending}
                  isLoading={followBusy}
                  onClick={handleFollow}
                >
                  {profile.is_following
                    ? 'Siguiendo'
                    : profile.follow_request_pending
                      ? 'Solicitud enviada'
                      : 'Seguir'}
                </Button>
              ) : null}
            </div>
          </Card>

          <div className="space-y-3">
            {postsLoading ? <Skeleton className="h-24" /> : null}
            {items.map((post) => (
              <SocialPostCard
                key={post.id}
                post={post}
                onReport={setReportPost}
                onViewProfile={navigateToPlayerProfile}
              />
            ))}
            {!postsLoading && items.length === 0 ? (
              <Card className="p-4 text-center text-sm text-text-secondary">Sin posts públicos.</Card>
            ) : null}
          </div>
        </>
      ) : null}

      <ReportPostModal post={reportPost} onClose={() => setReportPost(null)} />
    </div>
  );
}
