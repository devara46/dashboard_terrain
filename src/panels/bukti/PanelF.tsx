import { useMemo, useState } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { ScatterFit } from '../../components/charts/ScatterFit';
import { ComponentProfileBars } from '../../components/charts/ComponentProfileBars';
import { useAsync } from '../../lib/useAsync';
import { loadVillagesJoined, loadNonfarmByVillage } from '../../lib/dataLoader';
import { Skeleton } from '../../components/common/Value';
import { titleCase } from '../../lib/format';
import '../panels.css';

const DEFAULT_VILLAGE_ID = '3401120001'; // Kebon Harjo, Samigaluh, Kulon Progo — same worked example as Panel D

export function PanelF() {
  const villages = useAsync(loadVillagesJoined, []);
  const nonfarm = useAsync(loadNonfarmByVillage, []);
  const [selected, setSelected] = useState(DEFAULT_VILLAGE_ID);

  const sorted = useMemo(() => [...(villages.data ?? [])].sort((a, b) => a.desa.localeCompare(b.desa)), [villages.data]);
  const village = villages.data?.find((v) => v.village_id === selected);
  const profile = nonfarm.data?.get(selected);
  // Memoized so picking a different village in the dropdown doesn't redo the
  // 438-point OLS fit for a scatter that hasn't actually changed.
  const points = useMemo(() => (villages.data ?? []).map((v) => ({
    x: v.PAI, y: v.NonFarmEnt,
    color: v.TerrainPattern !== 'Neither channel terrain-constrained' ? 'var(--bukit)' : 'var(--andesit-soft)',
    outlined: v.TerrainPattern !== 'Neither channel terrain-constrained',
  })).sort((a, b) => Number(a.outlined) - Number(b.outlined)), [villages.data]);

  const loading = villages.loading || nonfarm.loading;
  if (loading) return <PanelSection id="basis-ekonomi" letter="F" title="Basis ekonomi non-pertanian"><Skeleton /></PanelSection>;
  if (!villages.data || !nonfarm.data) return <PanelSection id="basis-ekonomi" letter="F" title="Basis ekonomi non-pertanian"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;

  return (
    <PanelSection id="basis-ekonomi" letter="F" title="Basis ekonomi non-pertanian">
      <p className="panel-purpose">Sisi mekanisme permintaan, dilihat lewat sembilan komponen yang membangun basis ekonomi non-pertanian.</p>

      <div className="two-col">
        <div>
          <label className="filter-group-label" htmlFor="village-select">Pilih desa</label>
          <select id="village-select" value={selected} onChange={(e) => setSelected(e.target.value)} style={{ display: 'block', margin: '4px 0 12px', padding: 6, width: '100%', maxWidth: 320 }}>
            {sorted.map((v) => <option key={v.village_id} value={v.village_id}>{titleCase(v.desa)} — {titleCase(v.kabupaten)}</option>)}
          </select>
          {village && profile && (
            <>
              <p className="chart-row-label">{titleCase(village.desa)}, {titleCase(village.kecamatan)}</p>
              <ComponentProfileBars values={profile} />
              <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
                Pergeseran mata pencaharian tercatat: <strong>{village.LivelihoodShift ? 'ya' : 'tidak'}</strong>
              </p>
            </>
          )}
        </div>

        <div>
          <ScatterFit points={points} xLabel="Aksesibilitas fisik (PAI)" yLabel="Basis ekonomi non-pertanian (NonFarmEnt)" />
          <div className="legend-row" style={{ marginTop: 4 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--andesit)', background: 'var(--bukit)', display: 'inline-block' }} />
              terkendala medan (kanal mana pun)
            </span>
          </div>
        </div>
      </div>
    </PanelSection>
  );
}
