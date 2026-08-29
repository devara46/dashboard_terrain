export function StripPlot({
  allValues, value, median, width = 120, height = 16, color = 'var(--telaga)',
}: { allValues: number[]; value: number | null; median?: number; width?: number; height?: number; color?: string }) {
  const lo = Math.min(...allValues), hi = Math.max(...allValues);
  const x = (v: number) => ((v - lo) / (hi - lo || 1)) * (width - 8) + 4;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <line x1={4} x2={width - 4} y1={height / 2} y2={height / 2} stroke="var(--kontur)" strokeWidth={1} />
      {allValues.map((v, i) => (
        <circle key={i} cx={x(v)} cy={height / 2} r={1.1} fill="var(--kontur)" opacity={0.5} />
      ))}
      {median !== undefined && (
        <line x1={x(median)} x2={x(median)} y1={2} y2={height - 2} stroke="var(--andesit-soft)" strokeWidth={1.5} />
      )}
      {value !== null && (
        <circle cx={x(value)} cy={height / 2} r={3.4} fill={color} stroke="var(--andesit)" strokeWidth={0.6} />
      )}
    </svg>
  );
}
