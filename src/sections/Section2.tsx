import { useMemo, useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { Choropleth } from '../components/map/Choropleth';
import { useAsync } from '../lib/useAsync';
import { loadVillagesGeom, loadVillagesJoined, loadKapanewonBands } from '../lib/dataLoader';
import { titleCase, fmtCount } from '../lib/format';
import { districtTerm } from '../lib/adminTerms';
import { Skeleton } from '../components/common/Value';
import type { Band } from '../lib/types';
import './sections.css';

const FILTER_BANDS: Band[] = ['A', 'B', 'C'];

export function Section2() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const kapanewon = useAsync(loadKapanewonBands, []);
  const [filterBand, setFilterBand] = useState<Band | 'ALL'>('ALL');
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);
  const hoveredVillage = hovered ? byId.get(hovered) : null;

  const loading = geom.loading || villages.loading || kapanewon.loading;
  if (loading) return <AppSection id="peta-prioritas" number="2" title="Peta prioritas antar-desa"><Skeleton /></AppSection>;
  if (!geom.data || !villages.data || !kapanewon.data) {
    return <AppSection id="peta-prioritas" number="2" title="Peta prioritas antar-desa"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;
  }

  const selected = filterBand === 'ALL' ? villages.data : villages.data.filter((v) => v.action.band === filterBand);
  const nKab = new Set(selected.map((v) => v.kabupaten)).size;

  const topKecamatan = [...kapanewon.data].filter((k) => k.A > 0).slice(0, 6);

  return (
    <AppSection id="peta-prioritas" number="2" title="Peta prioritas antar-desa">
      <p className="panel-purpose">Peta tunggal yang menjawab di mana.</p>

      <div className="segmented" role="group" aria-label="Saring berdasarkan band">
        <button className={filterBand === 'ALL' ? 'active' : ''} onClick={() => setFilterBand('ALL')}>Semua</button>
        {FILTER_BANDS.map((b) => {
          const sample = villages.data!.find((v) => v.action.band === b);
          return (
            <button key={b} className={filterBand === b ? 'active' : ''} onClick={() => setFilterBand(b)}>
              {sample?.action.band_idn}
            </button>
          );
        })}
      </div>
      <p className="data-face" style={{ margin: 'var(--space-2) 0' }}>
        {fmtCount(selected.length)} desa di {fmtCount(nKab)} kabupaten/kota
      </p>

      <div className="two-col">
        <div style={{ position: 'relative' }}>
          <Choropleth
            geom={geom.data} width={480} height={520} pannable
            hoveredId={hovered} onHover={setHovered}
            dimIf={(id) => {
              const v = byId.get(id);
              return !v || (filterBand !== 'ALL' && v.action.band !== filterBand);
            }}
            colorFor={(id) => byId.get(id)?.action.color ?? '#cfcfc7'}
          />
          {hoveredVillage && (
            <div className="map-tooltip" style={{ position: 'absolute', left: 8, bottom: 8 }}>
              <strong className="place-name">{titleCase(hoveredVillage.desa)}</strong>, {titleCase(hoveredVillage.kecamatan)}<br />
              {hoveredVillage.action.verb_idn} ({hoveredVillage.action.band_idn})
            </div>
          )}
        </div>

        <div>
          <span className="subpanel-title">Titik konsentrasi</span>
          <ul className="condition-list">
            <li>Gunungkidul menampung 41 dari 48 desa Prioritas Pasokan Ganda, 85,4 persen. Dalam Gunungkidul sendiri, 28,5 persen desa berada pada band ini.</li>
            <li>Kulon Progo menampung 49 dari 88 desa pada Perkuat Ekonomi Lokal, 55,7 persen, proporsi tertinggi di DIY.</li>
            <li>Kota Yogyakarta tidak memiliki satu pun desa pada band Perkuat Ekonomi Lokal.</li>
          </ul>
          <span className="subpanel-title" style={{ marginTop: 'var(--space-4)', display: 'block' }}>
            {districtTerm('GUNUNGKIDUL')} dengan konsentrasi tertinggi pada Perlu Penanganan Segera
          </span>
          <ul className="condition-list">
            {topKecamatan.map((k) => (
              <li key={k.kabupaten + k.kecamatan}>
                {titleCase(k.kecamatan)}, {titleCase(k.kabupaten)}: {fmtCount(k.A)} desa
              </li>
            ))}
          </ul>
          <p className="caption">
            Angka tingkat kabupaten menunjukkan bahwa persoalan ini milik pemerintah kabupaten. Angka tingkat{' '}
            {districtTerm('GUNUNGKIDUL').toLowerCase()} menunjukkan ke mana harus mengirim orang.
          </p>
        </div>
      </div>
    </AppSection>
  );
}
