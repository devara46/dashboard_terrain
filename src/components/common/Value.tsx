import { fmtIndex, fmtCoef, isMissing } from '../../lib/format';

export function IndexValue({ value, dp = 3, signed = false }: { value: number | null | undefined; dp?: number; signed?: boolean }) {
  if (isMissing(value)) return <span className="missing data-face">{fmtIndex(value, dp, signed)}</span>;
  return <span className="data-face">{fmtIndex(value, dp, signed)}</span>;
}

export function CoefValue({ value }: { value: number | null | undefined }) {
  if (isMissing(value)) return <span className="missing data-face">{fmtCoef(value)}</span>;
  return <span className="data-face">{fmtCoef(value)}</span>;
}

export function Skeleton({ label = 'Memuat data…' }: { label?: string }) {
  return <div className="skeleton">{label}</div>;
}

export function LoadError({ error }: { error: Error }) {
  return <div className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat. ({error.message})</div>;
}
