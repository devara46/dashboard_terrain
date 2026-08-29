import { useInView, usePrefersReducedMotion } from '../../lib/useInView';
import { fmtCount } from '../../lib/format';
import './charts.css';

export function NestedSets({
  total, disConstrained, bothConstrained, width = 420, height = 420,
}: { total: number; disConstrained: number; bothConstrained: number; width?: number; height?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const reduced = usePrefersReducedMotion();
  const resolved = inView;
  const animate = inView && !reduced;

  const cx = width / 2, cy = height / 2;
  const rOuter = Math.min(width, height) / 2 - 8;
  // area proportional to count, radius proportional to sqrt(count)
  const rDis = rOuter * Math.sqrt(disConstrained / total) * 1.55;
  const rBoth = rOuter * Math.sqrt(bothConstrained / total) * 1.55;
  const transition = animate ? 'r 900ms cubic-bezier(0.4,0,0.2,1), opacity 500ms ease' : undefined;

  return (
    <div className="nested-sets" ref={ref}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label="Struktur bersarang keterkendalaan medan">
        <circle cx={cx} cy={cy} r={rOuter} fill="var(--kapur-raised)" stroke="var(--kontur)" strokeWidth={1} />
        <text x={cx} y={cy - rOuter - 14} textAnchor="middle" className="chart-axis-label">
          {fmtCount(total)} desa dan kelurahan di DIY
        </text>

        <circle
          cx={cx} cy={cy} r={resolved ? rDis : 2}
          fill="var(--bukit)" opacity={resolved ? 0.75 : 0}
          style={{ transition }}
        />
        <circle
          cx={cx} cy={cy} r={resolved ? rBoth : 2}
          fill="var(--andesit)" opacity={resolved ? 0.9 : 0}
          style={{ transition: animate ? `${transition}, opacity 500ms ease 500ms` : undefined }}
        />

        <text
          x={cx} y={cy + rDis * 0.62} textAnchor="middle" className="data-face nested-sets-label"
          opacity={resolved ? 1 : 0} style={{ transition: animate ? 'opacity 400ms ease 700ms' : undefined }}
        >
          {fmtCount(disConstrained)} — kanal digital
        </text>
        <text
          x={cx} y={cy + 4} textAnchor="middle" className="data-face nested-sets-label-inner"
          opacity={resolved ? 1 : 0} style={{ transition: animate ? 'opacity 400ms ease 900ms' : undefined }}
        >
          {fmtCount(bothConstrained)} — kedua kanal
        </text>
      </svg>
    </div>
  );
}
