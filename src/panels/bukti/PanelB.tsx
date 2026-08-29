import { useMemo, useState } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { Choropleth } from '../../components/map/Choropleth';
import { ScatterFit } from '../../components/charts/ScatterFit';
import { useAsync } from '../../lib/useAsync';
import { loadVillagesGeom, loadVillagesJoined, loadVillagesDecomposition } from '../../lib/dataLoader';
import { useVizConfig } from '../../context/VizConfigContext';
import { classColor } from '../../lib/colorScale';
import { disColor } from '../../lib/disClass';
import { Skeleton } from '../../components/common/Value';
import { fmtIndex, titleCase } from '../../lib/format';
import '../panels.css';

const TILES: { key: 'TRI' | 'PAI' | 'FFAS_count' | 'DIS'; label: string; ramp: string }[] = [
  { key: 'TRI', label: 'Keterjalan medan (TRI)', ramp: 'sequential_tri' },
  { key: 'PAI', label: 'Aksesibilitas fisik (PAI)', ramp: 'diverging_pai' },
  { key: 'FFAS_count', label: 'Akses keuangan formal', ramp: 'diverging_ffas_count' },
  { key: 'DIS', label: 'Infrastruktur digital (DIS)', ramp: 'dis_with_outliers' },
];

export function PanelB() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const decomposition = useAsync(loadVillagesDecomposition, []);
  const config = useVizConfig();
  const [hovered, setHovered] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const byId = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);
  const disConstrainedIds = useMemo(() => new Set(
    (decomposition.data ?? []).filter((d) => d.channel === 'DIS' && d.constraint_class === 'Terrain-constrained').map((d) => d.village_id),
  ), [decomposition.data]);
  const hoveredVillage = hovered ? byId.get(hovered) : null;
  // Memoized independent of hover/mouse state: onMouseMove over the map grid
  // (for the tooltip) fires on every pixel of movement, and without this the
  // 438-point OLS fit inside ScatterFit was recomputing on every tick.
  const kabColorsForPoints = config?.ramps.kabupaten as Record<string, string> | undefined;
  const points = useMemo(() => (villages.data ?? [])
    .map((v) => ({
      x: v.TRI_percentile_DIY, y: v.PAI_percentile_DIY,
      color: kabColorsForPoints?.[v.kabupaten] ?? '#999',
      outlined: disConstrainedIds.has(v.village_id),
    }))
    .sort((a, b) => Number(a.outlined) - Number(b.outlined)), [villages.data, kabColorsForPoints, disConstrainedIds]);

  const loading = geom.loading || villages.loading || decomposition.loading || !config;
  if (loading) return <PanelSection id="medan-aksesibilitas" letter="B" title="Medan dan aksesibilitas"><Skeleton /></PanelSection>;
  if (!geom.data || !villages.data || !decomposition.data) {
    return <PanelSection id="medan-aksesibilitas" letter="B" title="Medan dan aksesibilitas"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;
  }
  const geomData = geom.data;
  const kabColors = config.ramps.kabupaten as Record<string, string>;

  return (
    <PanelSection id="medan-aksesibilitas" letter="B" title="Medan dan aksesibilitas">
      <p className="panel-purpose">Keterjalan medan dan aksesibilitas fisik bergerak sebelum klasifikasi mana pun ditampilkan.</p>

      <div className="two-col">
        <div>
          <ScatterFit points={points} xLabel="Persentil keterjalan medan (TRI)" yLabel="Persentil aksesibilitas fisik (PAI)" />
          <div className="legend-row" style={{ marginTop: 4, flexWrap: 'wrap' }}>
            {Object.entries(kabColors).map(([kab, color]) => (
              <span key={kab} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 12 }}>
                <span style={{ width: 10, height: 10, background: color, display: 'inline-block' }} />{kab}
              </span>
            ))}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--andesit)', display: 'inline-block' }} />
              terkendala medan (kanal digital)
            </span>
          </div>
        </div>

        <div className="map-grid" onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}>
          {TILES.map((tile) => (
            <div className="map-tile" key={tile.key}>
              <span className="map-tile-label">{tile.label}</span>
              <Choropleth
                geom={geomData} width={280} height={260}
                hoveredId={hovered} onHover={setHovered}
                colorFor={(id) => {
                  const v = byId.get(id);
                  if (!v) return '#cfcfc7';
                  if (tile.key === 'DIS') return disColor(v.DIS, config);
                  const breaks = config.breaks[tile.key].values;
                  const ramp = config.ramps[tile.ramp] as string[];
                  return classColor(v[tile.key], breaks, ramp);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="caption">
        Keterjalan medan dan aksesibilitas fisik bergerak berlawanan arah. Desa yang kemudian diklasifikasikan
        terkendala medan pada kanal digital terkonsentrasi pada kombinasi keterjalan tinggi dan aksesibilitas rendah.
      </p>
      <p className="caption">
        Infrastruktur digital (DIS) memakai batas kelas tetap dalam rentang −5 sampai +5. Delapan desa di luar
        rentang ini — Girikarto, Balong, dan Nglindur di Gunungkidul pada ujung rendah; Sinduadi, Caturtunggal,
        Condongcatur, Maguwoharjo, dan Purwomartani di Sleman pada ujung tinggi — ditampilkan sebagai kelas ekstrem
        terpisah agar tidak meregangkan skala warna bagi 430 desa lainnya.
      </p>

      {hoveredVillage && (
        <div className="map-tooltip" style={{ position: 'fixed', left: mouse.x + 14, top: mouse.y + 14 }}>
          <strong className="place-name">{titleCase(hoveredVillage.desa)}</strong>, {titleCase(hoveredVillage.kecamatan)}<br />
          TRI {fmtIndex(hoveredVillage.TRI, 2)} · PAI {fmtIndex(hoveredVillage.PAI, 2, true)} ·{' '}
          FFAS {fmtIndex(hoveredVillage.FFAS_count, 2, true)} · DIS {fmtIndex(hoveredVillage.DIS, 2, true)}
        </div>
      )}
    </PanelSection>
  );
}
