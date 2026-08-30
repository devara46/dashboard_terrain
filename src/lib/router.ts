import { useEffect, useState } from 'react';

export interface Route {
  section: string;
  param: string | null;
}

const DEFAULT_ROUTE: Route = { section: 'ringkasan', param: null };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return DEFAULT_ROUTE;
  return { section: parts[0], param: parts[1] ?? null };
}

export function routeHref(section: string, param?: string): string {
  return `#/${section}${param ? '/' + param : ''}`;
}

export function navigate(section: string, param?: string): void {
  window.location.hash = routeHref(section, param);
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

export const RINGKASAN_SECTIONS = [
  { id: 'empat-keputusan', label: '1 · Empat jenis keputusan' },
  { id: 'peta-prioritas', label: '2 · Peta prioritas antar-desa' },
  { id: 'wilayah-saya', label: '3 · Gambaran per kabupaten dan kota' },
  { id: 'profil-desa', label: '4 · Profil desa' },
  { id: 'pembagian-peran', label: '5 · Pembagian peran antar-lembaga' },
] as const;

export const DASAR_BUKTI_SECTIONS = [
  { id: 'pertanyaan-diuji', label: '6 · Pertanyaan yang diuji' },
  { id: 'medan-aksesibilitas', label: '7 · Keterjalan medan dan aksesibilitas fisik' },
  { id: 'dua-kanal', label: '8 · Perbandingan sensitivitas kedua kanal' },
  { id: 'dimensi-kedua', label: '9 · Dependensi spasial antar-desa' },
  { id: 'terkendala-medan', label: '10 · Sebaran desa yang terkendala medan' },
  { id: 'mekanisme-keuangan', label: '11 · Mekanisme ekonomi pada kanal keuangan formal' },
  { id: 'batas-tafsir', label: '12 · Batas tafsir' },
] as const;
