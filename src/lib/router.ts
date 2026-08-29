import { useEffect, useState } from 'react';

export type Mode = 'bukti' | 'sasaran';

export interface Route {
  mode: Mode;
  panel: string;
  param: string | null;
}

const DEFAULT_ROUTE: Route = { mode: 'bukti', panel: 'temuan-utama', param: null };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return DEFAULT_ROUTE;
  const mode = parts[0] === 'sasaran' ? 'sasaran' : 'bukti';
  const panel = parts[1] ?? (mode === 'bukti' ? 'temuan-utama' : 'daftar-prioritas');
  const param = parts[2] ?? null;
  return { mode, panel, param };
}

export function routeHref(mode: Mode, panel: string, param?: string): string {
  return `#/${mode}/${panel}${param ? '/' + param : ''}`;
}

export function navigate(mode: Mode, panel: string, param?: string): void {
  window.location.hash = routeHref(mode, panel, param);
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const BUKTI_PANELS = [
  { id: 'temuan-utama', label: 'A · Temuan utama' },
  { id: 'medan-aksesibilitas', label: 'B · Medan dan aksesibilitas' },
  { id: 'kuadran', label: 'C · Kuadran permintaan dan ketersediaan' },
  { id: 'dekomposisi', label: 'D · Dekomposisi kesenjangan pasokan' },
  { id: 'divergensi', label: 'E · Divergensi antar kanal' },
  { id: 'basis-ekonomi', label: 'F · Basis ekonomi non-pertanian' },
] as const;

export const SASARAN_PANELS = [
  { id: 'daftar-prioritas', label: 'G · Daftar prioritas' },
  { id: 'batas-sumber', label: 'I · Batas tafsir dan sumber data' },
] as const;
