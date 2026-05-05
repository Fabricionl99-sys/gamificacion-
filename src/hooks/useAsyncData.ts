import { useEffect, useState } from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, fallback?: T) {
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
  }, [loader]);

  return { data, isLoading, loading: isLoading, error, isError: Boolean(error) };
}
