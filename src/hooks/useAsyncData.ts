import { useEffect, useState } from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, fallback?: T, deps: ReadonlyArray<unknown> = []) {
  const [data, setData] = useState<T | undefined>(fallback);
  const [isLoading, setLoading] = useState(fallback === undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loader()
      .then((result) => {
        if (!mounted) return;
        setData(result);
        setError(null);
      })
      .catch((reason) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason : new Error('Error cargando datos'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  // The caller controls refreshes with deps. This keeps inline loaders from
  // creating an infinite load loop while still allowing tab/detail changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, loading: isLoading, error, isError: Boolean(error) };
}
