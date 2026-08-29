import { useMemo } from 'react';
import { fmtIndex } from '../../lib/format';
import './charts.css';

export interface DecompRow {
  key: string;
  label: string;
  value: number;
  ciLow: number;
  ciHigh: number;
  dominant: boolean;
}

export function DecompositionBar({
  rows, width = 560, rowHeight = 56, dominanceMargin, supported,
}: { rows: DecompRow[]; width?: number; rowHeight?: number; dominanceMargin?: number; supported?: boolean }) {
  const margin = { top: 8, right: 24, bottom: 30, left: 160 };
  const plotW = width - margin.left - margin.right;
  const plotH = rows.length * rowHeight;
  const height = plotH + margin.top + margin.bottom;

  const dom = useMemo<[number, number]>(() => {
    const vals = rows.flatMap((r) => [r.ciLow, r.ciHigh, r.value, 0]);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.15 || 0.2;
    return [lo - pad, hi + pad];
  }, [rows]);
  const x = (v: number) => ((v - dom[0]) / (dom[1] - dom[0])) * plotW;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label="Dekomposisi kesenjangan pasokan">
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line x1={x(0)} x2={x(0)} y1={0} y2={plotH} stroke="var(--kontur)" strokeDasharray="2 3" />
          {rows.map((r, i) => {
            const y = i * rowHeight + rowHeight / 2;
            const barColor = r.dominant ? 'var(--bukit)' : 'var(--kontur)';
            return (
              <g key={r.key}>
                <text x={-14} y={y - 10} textAnchor="end" className="chart-row-label">{r.label}</text>
                <line x1={x(r.ciLow)} x2={x(r.ciHigh)} y1={y} y2={y} stroke={barColor} strokeWidth={2} opacity={0.5} />
                <line x1={x(r.ciLow)} x2={x(r.ciLow)} y1={y - 6} y2={y + 6} stroke={barColor} strokeWidth={2} opacity={0.5} />
                <line x1={x(r.ciHigh)} x2={x(r.ciHigh)} y1={y - 6} y2={y + 6} stroke={barColor} strokeWidth={2} opacity={0.5} />
                <rect
                  x={Math.min(x(0), x(r.value))} y={y - 8}
                  width={Math.abs(x(r.value) - x(0))} height={16}
                  fill={barColor}
                />
                <text x={x(r.value)} y={y + 24} textAnchor="middle" className="data-face" fontSize="0.7rem">
                  {fmtIndex(r.value, 3, true)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {dominanceMargin !== undefined && (
        <p className="data-face decomposition-margin">
          Margin dominasi: {fmtIndex(dominanceMargin, 3, true)}
          {supported !== undefined && (supported ? ' — didukung selang kepercayaan bootstrap' : ' — dominasi tidak signifikan pada selang kepercayaan bootstrap')}
        </p>
      )}
    </div>
  );
}
