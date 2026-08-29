import { useEffect, useRef, useState } from 'react';
import type { VillageGeomCollection } from '../../lib/types';
import { getCachedPaths, computePathsAsync } from '../../lib/pathCache';
import './map.css';

export interface ChoroplethProps {
  geom: VillageGeomCollection;
  colorFor: (village_id: string) => string;
  width?: number;
  height?: number;
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  pannable?: boolean;
  dimIf?: (village_id: string) => boolean;
  hatchIf?: (village_id: string) => boolean;
}

export function Choropleth({
  geom, colorFor, width = 480, height = 480, hoveredId, onHover, onSelect, pannable = false, dimIf, hatchIf,
}: ChoroplethProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const dragState = useRef<{ x: number; y: number } | null>(null);

  const [paths, setPaths] = useState(() => getCachedPaths(geom, width, height));
  useEffect(() => {
    const cached = getCachedPaths(geom, width, height);
    if (cached) { setPaths(cached); return; }
    setPaths(null);
    let alive = true;
    computePathsAsync(geom, width, height).then((result) => { if (alive) setPaths(result); });
    return () => { alive = false; };
  }, [geom, width, height]);

  function onWheel(e: React.WheelEvent) {
    if (!pannable) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setTransform((t) => ({ ...t, k: Math.min(8, Math.max(1, t.k * delta)) }));
  }
  function onPointerDown(e: React.PointerEvent) {
    if (!pannable) return;
    dragState.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!pannable || !dragState.current) return;
    setTransform((t) => ({ ...t, x: e.clientX - dragState.current!.x, y: e.clientY - dragState.current!.y }));
  }
  function onPointerUp() { dragState.current = null; }

  if (!paths) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}>
        <rect x={0} y={0} width={width} height={height} fill="var(--kapur-raised)" />
        <text x={width / 2} y={height / 2} textAnchor="middle" className="chart-axis-label">Memuat peta…</text>
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, touchAction: pannable ? 'none' : undefined }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <defs>
        <pattern id="hatch-gk" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--andesit)" strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
        {geom.features.map((f) => {
          const id = f.properties.village_id;
          const isHover = hoveredId === id;
          const dimmed = dimIf?.(id) ?? false;
          return (
            <path
              key={id}
              d={paths.get(id) ?? ''}
              fill={colorFor(id)}
              opacity={dimmed ? 0.18 : 1}
              stroke={isHover ? 'var(--andesit)' : 'rgba(28,39,36,0.35)'}
              strokeWidth={isHover ? 1.4 : 0.3}
              onMouseEnter={() => onHover?.(id)}
              onMouseLeave={() => onHover?.(null)}
              onClick={() => onSelect?.(id)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            />
          );
        })}
        {hatchIf && geom.features.filter((f) => hatchIf(f.properties.village_id)).map((f) => (
          <path key={'hatch-' + f.properties.village_id} d={paths.get(f.properties.village_id) ?? ''} fill="url(#hatch-gk)" pointerEvents="none" />
        ))}
      </g>
    </svg>
  );
}
