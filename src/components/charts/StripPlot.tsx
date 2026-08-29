import { getStripBackground, stripScale } from '../../lib/stripBackground';

export function StripPlot({
  allValues, value, median, width = 120, height = 16, color = 'var(--telaga)',
}: { allValues: number[]; value: number | null; median?: number; width?: number; height?: number; color?: string }) {
  const background = getStripBackground(allValues, width, height);
  const x = stripScale(allValues, width, height);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`} width={width} height={height}
      style={{ backgroundImage: background, backgroundSize: '100% 100%' }}
    >
      {median !== undefined && (
        <line x1={x(median)} x2={x(median)} y1={2} y2={height - 2} stroke="var(--andesit-soft)" strokeWidth={1.5} />
      )}
      {value !== null && (
        <circle cx={x(value)} cy={height / 2} r={3.4} fill={color} stroke="var(--andesit)" strokeWidth={0.6} />
      )}
    </svg>
  );
}
