import { useMemo } from 'react';
import { fmtIndex } from '../../lib/format';
import './charts.css';

export const NONFARM_COMPONENTS: { field: string; label: string }[] = [
  { field: 'kelompok_pertokoan', label: 'Kelompok pertokoan' },
  { field: 'pasar_permanen', label: 'Pasar permanen' },
  { field: 'pasar_semi_permanen', label: 'Pasar semi permanen' },
  { field: 'minimarket', label: 'Minimarket' },
  { field: 'restoran', label: 'Restoran' },
  { field: 'warung_makan', label: 'Warung makan' },
  { field: 'toko_kelontong', label: 'Toko kelontong' },
  { field: 'industri_mikro', label: 'Industri mikro' },
  { field: 'sentra_industri', label: 'Sentra industri' },
];

export const SPARSE_COMPONENTS = new Set(['pasar_permanen', 'pasar_semi_permanen', 'sentra_industri', 'kelompok_pertokoan']);

export function ComponentProfileBars({
  values, width = 480, rowHeight = 32,
}: { values: Record<string, number>; width?: number; rowHeight?: number }) {
  const margin = { top: 4, right: 24, bottom: 8, left: 150 };
  const plotW = width - margin.left - margin.right;
  const plotH = NONFARM_COMPONENTS.length * rowHeight;
  const height = plotH + margin.top + margin.bottom;

  const dom = useMemo<[number, number]>(() => {
    const vals = NONFARM_COMPONENTS.map((c) => values[c.field] ?? 0);
    const lo = Math.min(...vals, 0), hi = Math.max(...vals, 0);
    const pad = (hi - lo) * 0.2 || 0.5;
    return [lo - pad, hi + pad];
  }, [values]);
  const x = (v: number) => ((v - dom[0]) / (dom[1] - dom[0])) * plotW;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label="Profil komponen ekonomi non-pertanian">
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line x1={x(0)} x2={x(0)} y1={0} y2={plotH} stroke="var(--kontur)" strokeDasharray="2 3" />
          {NONFARM_COMPONENTS.map((c, i) => {
            const v = values[c.field] ?? 0;
            const y = i * rowHeight + rowHeight / 2;
            const sparse = SPARSE_COMPONENTS.has(c.field);
            const color = sparse ? 'var(--kontur)' : 'var(--telaga)';
            return (
              <g key={c.field}>
                <text x={-10} y={y} textAnchor="end" dominantBaseline="middle" className="chart-row-label" fontSize="0.72rem" opacity={sparse ? 0.7 : 1}>
                  {c.label}
                </text>
                <rect x={Math.min(x(0), x(v))} y={y - 7} width={Math.abs(x(v) - x(0))} height={14} fill={color} opacity={sparse ? 0.55 : 0.9} />
                <text x={x(v) + (v >= 0 ? 6 : -6)} y={y} dominantBaseline="middle" textAnchor={v >= 0 ? 'start' : 'end'} className="data-face" fontSize="0.68rem">
                  {fmtIndex(v, 2, true)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="caption" style={{ marginTop: 'var(--space-1)' }}>
        Komponen berwarna redup — kelompok pertokoan, pasar permanen, pasar semi permanen, sentra industri —
        memiliki sebaran terbatas (tiga sampai tujuh nilai berbeda pada seluruh 438 desa).
      </p>
    </div>
  );
}
