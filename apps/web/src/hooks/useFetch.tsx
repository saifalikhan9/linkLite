import { useCallback, useEffect, useState } from "react";

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetcher();

      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
