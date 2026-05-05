import { getActiveBoosts } from '../api/boost';
import { useAsyncData } from './useAsyncData';

export function useActiveBoosts() {
  const { data: boosts = [], isLoading, error } = useAsyncData(getActiveBoosts, []);
  const now = Date.now();

  return {
    boosts: boosts.filter((boost) => boost.enabled && new Date(boost.starts_at).getTime() <= now && new Date(boost.ends_at).getTime() >= now),
    isLoading,
    error,
  };
}
