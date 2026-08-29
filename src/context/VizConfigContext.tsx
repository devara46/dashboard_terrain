import { createContext, useContext, type ReactNode } from 'react';
import { loadVizConfig } from '../lib/dataLoader';
import { useAsync } from '../lib/useAsync';
import type { VizConfig } from '../lib/types';

const VizConfigCtx = createContext<VizConfig | null>(null);

export function VizConfigProvider({ children }: { children: ReactNode }) {
  const { data } = useAsync(loadVizConfig, []);
  return <VizConfigCtx.Provider value={data}>{children}</VizConfigCtx.Provider>;
}

export function useVizConfig(): VizConfig | null {
  return useContext(VizConfigCtx);
}
