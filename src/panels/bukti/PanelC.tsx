import { useMemo, useState } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { Choropleth } from '../../components/map/Choropleth';
import { useAsync } from '../../lib/useAsync';
import { loadVillagesGeom, loadVillagesJoined } from '../../lib/dataLoader';
import { useVizConfig } from '../../context/VizConfigContext';
import { Skeleton } from '../../components/common/Value';
import { titleCase } from '../../lib/format';
import '../panels.css';

const QUAD_ORDER = ['Well-served', 'Priority Intervention', 'Structurally Lagging', 'Oversupplied'] as const;

export function PanelC() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const config = useVizConfig();
  const [channel, setChannel] = useState<'FFAS' | 'DIS'>('FFAS');
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);
  const hoveredVillage = hovered ? byId.get(hovered) : null;

  if (geom.loading || villages.loading || !config) return <PanelSection id="kuadran" letter="C" title="Kuadran permintaan dan ketersediaan"><Skeleton /></PanelSection>;
  if (!geom.data || !villages.data) return <PanelSection id="kuadran" letter="C" title="Kuadran permintaan dan ketersediaan"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;

  const quadColors = config.ramps.quadrant as Record<string, string>;
  const idnField = channel === 'FFAS' ? 'q_ffas_idn' : 'q_dis_idn';
  const quadField = channel === 'FFAS' ? 'Q_FFAS' : 'Q_DIS';

  return (
    <PanelSection id="kuadran" letter="C" title="Kuadran permintaan dan ketersediaan">
      <div className="notice-bar">
        Kuadran pada peta ini bersifat deskriptif. Kuadran disusun dari posisi relatif indeks permintaan terhadap
        ketersediaan layanan, dan tidak digunakan sebagai variabel dalam estimasi mana pun.
      </div>

      <div className="segmented" style={{ marginTop: 'var(--space-4)' }}>
        <button className={channel === 'FFAS' ? 'active' : ''} onClick={() => setChannel('FFAS')}>Kanal keuangan formal</button>
        <button className={channel === 'DIS' ? 'active' : ''} onClick={() => setChannel('DIS')}>Kanal infrastruktur digital</button>
      </div>

      <div style={{ marginTop: 'var(--space-4)', position: 'relative' }}>
        <Choropleth
          geom={geom.data} width={720} height={560} pannable
          hoveredId={hovered} onHover={setHovered}
          colorFor={(id) => {
            const v = byId.get(id);
            if (!v) return '#cfcfc7';
            return quadColors[v[quadField]] ?? '#cfcfc7';
          }}
        />
        {hoveredVillage && (
          <div className="map-tooltip" style={{ position: 'absolute', left: 8, bottom: 8 }}>
            <strong className="place-name">{titleCase(hoveredVillage.desa)}</strong>, {titleCase(hoveredVillage.kecamatan)}<br />
            {hoveredVillage[idnField]}
          </div>
        )}
      </div>

      <div className="map-legend" style={{ marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {QUAD_ORDER.map((q) => {
          const sample = villages.data!.find((v) => v[quadField] === q);
          const label = sample ? sample[idnField] : q;
          return (
            <span key={q} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="map-legend-swatch" style={{ background: quadColors[q] }} />{label}
            </span>
          );
        })}
      </div>

      <p className="caption" style={{ marginTop: 'var(--space-4)' }}>
        Permintaan adalah satu atribut desa, bukan properti per kanal — tingkat permintaan yang tercatat identik
        pada kedua kanal untuk seluruh 438 desa dan kelurahan.
      </p>
    </PanelSection>
  );
}
