import { useMemo } from 'react';
import { fmtIndex } from '../../lib/format';
import './charts.css';

export interface ScatterPoint { x: number; y: number; color?: string; label?: string; outlined?: boolean; }

export function ScatterFit({
  points, width = 560, height = 380, xLabel, yLabel,
}: { points: ScatterPoint[]; width?: number; height?: number; xLabel: string; yLabel: string }) {
  const margin = { top: 16, right: 20, bottom: 44, left: 56 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const { xDom, yDom, fit } = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const xlo = Math.min(...xs), xhi = Math.max(...xs);
    const ylo = Math.min(...ys), yhi = Math.max(...ys);
    const n = points.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    points.forEach((p) => { num += (p.x - mx) * (p.y - my); den += (p.x - mx) ** 2; });
    const slope = num / den;
    const intercept = my - slope * mx;
    const resid = points.map((p) => p.y - (intercept + slope * p.x));
    const s2 = resid.reduce((a, b) => a + b * b, 0) / (n - 2);
    const se = Math.sqrt(s2 / den);
    return {
      xDom: [xlo - (xhi - xlo) * 0.05, xhi + (xhi - xlo) * 0.05] as [number, number],
      yDom: [ylo - (yhi - ylo) * 0.1, yhi + (yhi - ylo) * 0.1] as [number, number],
      fit: { slope, intercept, se },
    };
  }, [points]);

  const x = (v: number) => ((v - xDom[0]) / (xDom[1] - xDom[0])) * w;
  const y = (v: number) => h - ((v - yDom[0]) / (yDom[1] - yDom[0])) * h;

  const linePts = useMemo(() => {
    const steps = 40;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const xv = xDom[0] + ((xDom[1] - xDom[0]) * i) / steps;
      const yv = fit.intercept + fit.slope * xv;
      const band = fit.se * 1.96 * Math.sqrt(1 + Math.abs(i - steps / 2) / steps);
      return { xv, yv, lo: yv - band, hi: yv + band };
    });
  }, [xDom, fit]);

  const bandPath = useMemo(() => {
    const top = linePts.map((p) => `${x(p.xv)},${y(p.hi)}`).join(' L ');
    const bottom = [...linePts].reverse().map((p) => `${x(p.xv)},${y(p.lo)}`).join(' L ');
    return `M ${top} L ${bottom} Z`;
  }, [linePts]);

  const xTicks = niceTicks(xDom);
  const yTicks = niceTicks(yDom);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((t) => (
          <g key={'y' + t}>
            <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke="var(--kontur)" strokeOpacity={0.2} />
            <text x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="chart-axis-label">{fmtIndex(t, 1)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={'x' + t} x={x(t)} y={h + 18} textAnchor="middle" className="chart-axis-label">{fmtIndex(t, 1)}</text>
        ))}
        <path d={bandPath} fill="var(--telaga)" opacity={0.12} />
        <path d={linePts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.xv)} ${y(p.yv)}`).join(' ')} fill="none" stroke="var(--telaga)" strokeWidth={2} />
        {points.map((p, i) => (
          <circle
            key={i} cx={x(p.x)} cy={y(p.y)} r={p.outlined ? 4 : 3}
            fill={p.color ?? 'var(--andesit-soft)'} opacity={p.outlined ? 0.95 : 0.65}
            stroke={p.outlined ? 'var(--andesit)' : 'none'} strokeWidth={p.outlined ? 1.4 : 0}
          />
        ))}
        <text x={w / 2} y={h + 36} textAnchor="middle" className="chart-axis-title">{xLabel}</text>
        <text x={-h / 2} y={-40} transform="rotate(-90)" textAnchor="middle" className="chart-axis-title">{yLabel}</text>
      </g>
    </svg>
  );
}

function niceTicks([lo, hi]: [number, number], count = 5): number[] {
  const rough = (hi - lo) / count;
  const pow = Math.pow(10, Math.floor(Math.log10(Math.abs(rough) || 1)));
  const norm = rough / pow;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
  const out: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) out.push(Number(t.toFixed(3)));
  return out;
}
