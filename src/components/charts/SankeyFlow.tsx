import { useMemo } from 'react';
import './charts.css';

const QUAD_ORDER = ['Well-served', 'Priority Intervention', 'Structurally Lagging', 'Oversupplied'] as const;

export function SankeyFlow({
  pairs, idnLabel, colorFor, width = 640, height = 420,
}: {
  pairs: { ffas: string; dis: string }[];
  idnLabel: (q: string) => string;
  colorFor: (q: string) => string;
  width?: number;
  height?: number;
}) {
  const margin = { top: 24, right: 160, bottom: 24, left: 160 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const nodeW = 16;
  const gap = 10;

  const { leftNodes, rightNodes, ribbons } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of pairs) {
      const k = `${p.ffas}|${p.dis}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const leftTotals = new Map<string, number>(QUAD_ORDER.map((q) => [q, 0]));
    const rightTotals = new Map<string, number>(QUAD_ORDER.map((q) => [q, 0]));
    for (const p of pairs) {
      leftTotals.set(p.ffas, (leftTotals.get(p.ffas) ?? 0) + 1);
      rightTotals.set(p.dis, (rightTotals.get(p.dis) ?? 0) + 1);
    }
    const total = pairs.length;
    const usableH = plotH - gap * (QUAD_ORDER.length - 1);
    const scale = (n: number) => (n / total) * usableH;

    let yL = 0;
    const leftNodes = QUAD_ORDER.map((q) => {
      const h = scale(leftTotals.get(q) ?? 0);
      const node = { q, y: yL, h };
      yL += h + gap;
      return node;
    });
    let yR = 0;
    const rightNodes = QUAD_ORDER.map((q) => {
      const h = scale(rightTotals.get(q) ?? 0);
      const node = { q, y: yR, h };
      yR += h + gap;
      return node;
    });

    const leftCursor = new Map(QUAD_ORDER.map((q) => [q, leftNodes.find((n) => n.q === q)!.y]));
    const rightCursor = new Map(QUAD_ORDER.map((q) => [q, rightNodes.find((n) => n.q === q)!.y]));
    const ribbons: { ffas: string; dis: string; y0: number; h0: number; y1: number; h1: number; n: number; same: boolean }[] = [];
    for (const ffas of QUAD_ORDER) {
      for (const dis of QUAD_ORDER) {
        const n = counts.get(`${ffas}|${dis}`) ?? 0;
        if (n === 0) continue;
        const h = scale(n);
        const y0 = leftCursor.get(ffas)!;
        const y1 = rightCursor.get(dis)!;
        leftCursor.set(ffas, y0 + h);
        rightCursor.set(dis, y1 + h);
        ribbons.push({ ffas, dis, y0, h0: h, y1, h1: h, n, same: ffas === dis });
      }
    }
    return { leftNodes, rightNodes, ribbons };
  }, [pairs, plotH]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label="Diagram alir kuadran">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {ribbons.map((r, i) => {
          const x0 = nodeW, x1 = plotW - nodeW;
          const midX = (x0 + x1) / 2;
          const path = `M ${x0},${r.y0} C ${midX},${r.y0} ${midX},${r.y1} ${x1},${r.y1}
                        L ${x1},${r.y1 + r.h1} C ${midX},${r.y1 + r.h1} ${midX},${r.y0 + r.h0} ${x0},${r.y0 + r.h0} Z`;
          return (
            <path
              key={i} d={path}
              fill={colorFor(r.ffas)}
              opacity={r.same ? 0.18 : 0.55}
            />
          );
        })}
        {leftNodes.map((n) => n.h > 0 && (
          <g key={'l-' + n.q}>
            <rect x={0} y={n.y} width={nodeW} height={n.h} fill={colorFor(n.q)} />
            <text x={-8} y={n.y + n.h / 2} textAnchor="end" dominantBaseline="middle" className="chart-row-label" fontSize="0.72rem">
              {idnLabel(n.q)}
            </text>
          </g>
        ))}
        {rightNodes.map((n) => n.h > 0 && (
          <g key={'r-' + n.q}>
            <rect x={plotW - nodeW} y={n.y} width={nodeW} height={n.h} fill={colorFor(n.q)} />
            <text x={plotW + 8} y={n.y + n.h / 2} dominantBaseline="middle" className="chart-row-label" fontSize="0.72rem">
              {idnLabel(n.q)}
            </text>
          </g>
        ))}
        <text x={0} y={-8} className="chart-axis-label">Kanal keuangan formal</text>
        <text x={plotW - 40} y={-8} className="chart-axis-label">Kanal digital</text>
      </g>
    </svg>
  );
}
