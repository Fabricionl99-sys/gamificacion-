import { useCallback, useEffect, useState } from 'react';

import { socialApi } from '../api/socialApi';
import type { SocialProfileMe } from '../types/socialModule';

export function useSocialProfile() {
  const [profile, setProfile] = useState<SocialProfileMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await socialApi.getMyProfile();
      setProfile(data);
    } catch {
      setError('No pudimos cargar tu perfil social');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, isLoading, error, refresh, setProfile };
}
