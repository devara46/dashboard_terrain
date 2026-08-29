import { useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setState({ data: null, loading: true, error: null });
    loader()
      .then((data) => { if (alive.current) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (alive.current) setState({ data: null, loading: false, error }); });
    return () => { alive.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
