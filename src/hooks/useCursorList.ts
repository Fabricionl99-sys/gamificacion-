import { useCallback, useEffect, useState } from 'react';

import type { SocialCursorPage } from '../types/socialModule';
import { parseSocialError } from '../utils/socialErrors';

export function useCursorList<T>(loader: (cursor?: string | null) => Promise<SocialCursorPage<T>>, deps: unknown[] = []) {
  const [items, setItems] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const page = await loader(null);
      setItems(page.items);
      setNextCursor(page.next_cursor);
    } catch (err) {
      setError(parseSocialError(err).message);
      setItems([]);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await loader(nextCursor);
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.next_cursor);
    } catch (err) {
      setError(parseSocialError(err).message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, loader, nextCursor]);

  const reset = useCallback(() => {
    void loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    void loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps drive reload
  }, deps);

  return { items, isLoading, isLoadingMore, error, nextCursor, loadMore, reset, setItems };
}
