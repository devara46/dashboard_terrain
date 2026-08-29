import { useMemo, useState } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { Choropleth } from '../../components/map/Choropleth';
import { DecompositionBar } from '../../components/charts/DecompositionBar';
import { useAsync } from '../../lib/useAsync';
import {
  loadVillagesGeom, loadVillagesJoined, loadVillagesDecomposition, loadDecompositionByVillage, loadAggKabupaten,
} from '../../lib/dataLoader';
import { useVizConfig } from '../../context/VizConfigContext';
import { Skeleton } from '../../components/common/Value';
import { fmtCount, fmtIndex, titleCase } from '../../lib/format';
import '../panels.css';

const WORKED_EXAMPLE_ID = '3401120001'; // Kebon Harjo, Samigaluh, Kulon Progo
const CLASS_ORDER = ['Terrain-constrained', 'Residual-constrained', 'No significant dominance'] as const;
const CLASS_IDN: Record<string, string> = {
  'Terrain-constrained': 'Dominan Medan',
  'Residual-constrained': 'Dominan Residual / Non-Terrain',
  'No significant dominance': 'Tidak Ada Dominasi Signifikan',
};
const EMPTY_DECOMP_MAP = new Map<string, { FFAS?: { constraint_class: string }; DIS?: { constraint_class: string } }>();

export function PanelD() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const decomposition = useAsync(loadVillagesDecomposition, []);
  const decompByVillage = useAsync(loadDecompositionByVillage, []);
  const agg = useAsync(loadAggKabupaten, []);
  const config = useVizConfig();
  const [hovered, setHovered] = useState<string | null>(null);

  const byId = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);
  const aggByKab = useMemo(() => new Map((agg.data ?? []).map((a) => [a.kabupaten, a])), [agg.data]);
  const hoveredVillage = hovered ? byId.get(hovered) : null;
  const hoveredAgg = hoveredVillage ? aggByKab.get(hoveredVillage.kabupaten) : null;
  // These must run on every render regardless of loading state (Rules of Hooks) —
  // they fall back to empty inputs until the underlying data has loaded.
  const classCounts = useMemoClassCounts(decomposition.data ?? []);
  const crossTab = useMemoCrossTab(decompByVillage.data ?? EMPTY_DECOMP_MAP);

  const loading = geom.loading || villages.loading || decomposition.loading || decompByVillage.loading || agg.loading || !config;
  if (loading) return <PanelSection id="dekomposisi" letter="D" title="Dekomposisi kesenjangan pasokan"><Skeleton /></PanelSection>;
  if (!geom.data || !villages.data || !decomposition.data || !decompByVillage.data) {
    return <PanelSection id="dekomposisi" letter="D" title="Dekomposisi kesenjangan pasokan"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;
  }

  const worked = decompByVillage.data.get(WORKED_EXAMPLE_ID);
  const workedVillage = byId.get(WORKED_EXAMPLE_ID);
  const patternColors = config.ramps.terrain_pattern as Record<string, string>;

  return (
    <PanelSection id="dekomposisi" letter="D" title="Dekomposisi kesenjangan pasokan">
      <p className="panel-purpose">
        Setiap desa memiliki kesenjangan pasokan yang diuraikan menjadi komponen medan dan komponen residual.
        Desa diklasifikasikan terkendala medan hanya jika komponen medan mendominasi dan dominasi tersebut
        didukung selang kepercayaan bootstrap.
      </p>

      {workedVillage && worked?.FFAS && worked?.DIS && (
        <div className="subpanel">
          <span className="subpanel-title">D1. Cara membaca satu desa — {titleCase(workedVillage.desa)}, {titleCase(workedVillage.kabupaten)}</span>
          <p className="caption">
            Berada pada persentil {fmtIndex(workedVillage.TRI_percentile_DIY, 1)} keterjalan medan dan persentil{' '}
            {fmtIndex(workedVillage.PAI_percentile_DIY, 1)} aksesibilitas, dan terkendala medan pada kedua kanal.
          </p>
          <div className="two-col">
            <div>
              <p className="chart-row-label" style={{ marginBottom: 4 }}>Kanal keuangan formal</p>
              <DecompositionBar
                rows={[
                  { key: 'terrain', label: 'Komponen medan', value: worked.FFAS!.gap_terrain, ciLow: worked.FFAS!.ci_lo_terrain, ciHigh: worked.FFAS!.ci_hi_terrain, dominant: worked.FFAS!.constraint_class === 'Terrain-constrained' },
                  { key: 'residual', label: 'Komponen residual', value: worked.FFAS!.gap_residual, ciLow: worked.FFAS!.ci_lo_residual, ciHigh: worked.FFAS!.ci_hi_residual, dominant: false },
                ]}
                dominanceMargin={worked.FFAS!.dominance_margin}
                supported={worked.FFAS!.constraint_class !== 'No significant dominance'}
              />
            </div>
            <div>
              <p className="chart-row-label" style={{ marginBottom: 4 }}>Kanal infrastruktur digital</p>
              <DecompositionBar
                rows={[
                  { key: 'terrain', label: 'Komponen medan', value: worked.DIS!.gap_terrain, ciLow: worked.DIS!.ci_lo_terrain, ciHigh: worked.DIS!.ci_hi_terrain, dominant: worked.DIS!.constraint_class === 'Terrain-constrained' },
                  { key: 'residual', label: 'Komponen residual', value: worked.DIS!.gap_residual, ciLow: worked.DIS!.ci_lo_residual, ciHigh: worked.DIS!.ci_hi_residual, dominant: false },
                ]}
                dominanceMargin={worked.DIS!.dominance_margin}
                supported={worked.DIS!.constraint_class !== 'No significant dominance'}
              />
            </div>
          </div>
        </div>
      )}

      <div className="subpanel">
        <span className="subpanel-title">D2. Tiga kelas, per kanal</span>
        <div className="two-col">
          <ClassBar title="Kanal keuangan formal" counts={classCounts.FFAS} />
          <ClassBar title="Kanal infrastruktur digital" counts={classCounts.DIS} />
        </div>
      </div>

      <div className="subpanel rule-block">
        <strong>Kualifikasi penting.</strong> Pada kanal keuangan formal, komponen residual mendominasi pada{' '}
        {fmtCount(classCounts.FFAS['Residual-constrained'])} desa, jauh melampaui {fmtCount(classCounts.FFAS['Terrain-constrained'])} desa
        dengan dominasi medan. Komponen residual tidak mengidentifikasi penyebab. Ia mencakup cakupan penyedia dan
        agen, desain layanan, keterjangkauan, kapasitas kelembagaan, serta faktor lain yang tidak dipisahkan dalam
        dekomposisi ini. Temuan bahwa medan jarang mendominasi kanal keuangan formal adalah temuan tentang medan,
        bukan pernyataan bahwa kesenjangan tersebut kecil.
      </div>

      <div className="subpanel">
        <span className="subpanel-title">D4. Klasifikasi silang</span>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                {CLASS_ORDER.map((c) => <th key={c}>DIS: {CLASS_IDN[c]}</th>)}
              </tr>
            </thead>
            <tbody>
              {CLASS_ORDER.map((rowClass) => (
                <tr key={rowClass}>
                  <th style={{ textAlign: 'left' }}>FFAS: {CLASS_IDN[rowClass]}</th>
                  {CLASS_ORDER.map((colClass) => {
                    const n = crossTab[rowClass]?.[colClass] ?? 0;
                    const emphasize = rowClass === 'Terrain-constrained';
                    return (
                      <td key={colClass} className="num" style={emphasize ? { fontWeight: 700, background: 'var(--kapur-raised)' } : undefined}>
                        {fmtCount(n)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="caption">Baris bawah adalah temuan utama dalam bentuk tabel. Kedua nol membawa kesimpulannya.</p>
      </div>

      <div className="subpanel">
        <span className="subpanel-title">D5. Peta pola keterkendalaan medan</span>
        <div style={{ position: 'relative' }}>
          <Choropleth
            geom={geom.data} width={640} height={520}
            hoveredId={hovered} onHover={setHovered}
            colorFor={(id) => {
              const v = byId.get(id);
              return v ? patternColors[v.TerrainPattern] ?? '#cfcfc7' : '#cfcfc7';
            }}
          />
          {hoveredVillage && hoveredAgg && (
            <div className="map-tooltip" style={{ position: 'absolute', left: 8, bottom: 8 }}>
              <strong className="place-name">{titleCase(hoveredVillage.desa)}</strong>, {titleCase(hoveredVillage.kabupaten)}<br />
              Kabupaten: {fmtCount(hoveredAgg.n_ffas_terrain)} terkendala FFAS, {fmtCount(hoveredAgg.n_dis_terrain)} terkendala DIS,{' '}
              {fmtCount(hoveredAgg.n_both_terrain)} terkendala keduanya
            </div>
          )}
        </div>
        <div className="map-legend" style={{ marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <LegendSwatch color={patternColors['Neither channel terrain-constrained']} label={`Tidak Ada Kanal Terkendala Medan (${fmtCount(374)})`} />
          <LegendSwatch color={patternColors['DIS terrain-constrained only']} label={`Hanya Kanal Digital Terkendala Medan (${fmtCount(57)})`} />
          <LegendSwatch color={patternColors['Both channels terrain-constrained']} label={`Kedua Kanal Terkendala Medan (${fmtCount(7)})`} />
        </div>
      </div>
    </PanelSection>
  );
}

function ClassBar({ title, counts }: { title: string; counts: Record<string, number> }) {
  const total = CLASS_ORDER.reduce((a, c) => a + counts[c], 0);
  return (
    <div>
      <p className="chart-row-label" style={{ marginBottom: 6 }}>{title}</p>
      <div className="class-stacked-bar">
        {CLASS_ORDER.map((c) => (
          <div
            key={c}
            className="class-stacked-segment"
            style={{ width: `${(counts[c] / total) * 100}%`, background: c === 'Terrain-constrained' ? 'var(--bukit)' : c === 'Residual-constrained' ? 'var(--kontur)' : 'var(--kapur-raised)' }}
            title={`${CLASS_IDN[c]}: ${counts[c]}`}
          />
        ))}
      </div>
      <div className="class-stacked-legend">
        {CLASS_ORDER.map((c) => (
          <span key={c} className="legend-row">
            <span className="map-legend-swatch" style={{ background: c === 'Terrain-constrained' ? 'var(--bukit)' : c === 'Residual-constrained' ? 'var(--kontur)' : 'var(--kapur-raised)' }} />
            {CLASS_IDN[c]}: {fmtCount(counts[c])}
          </span>
        ))}
      </div>
    </div>
  );
}
function LegendSwatch({ color, label }: { color: string; label: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="map-legend-swatch" style={{ background: color }} />{label}</span>;
}

function useMemoClassCounts(rows: { channel: 'FFAS' | 'DIS'; constraint_class: string }[]) {
  return useMemo(() => {
    const out = { FFAS: { 'Terrain-constrained': 0, 'Residual-constrained': 0, 'No significant dominance': 0 } as Record<string, number>,
                  DIS: { 'Terrain-constrained': 0, 'Residual-constrained': 0, 'No significant dominance': 0 } as Record<string, number> };
    for (const r of rows) out[r.channel][r.constraint_class] = (out[r.channel][r.constraint_class] ?? 0) + 1;
    return out;
  }, [rows]);
}

function useMemoCrossTab(byVillage: Map<string, { FFAS?: { constraint_class: string }; DIS?: { constraint_class: string } }>) {
  return useMemo(() => {
    const table: Record<string, Record<string, number>> = {};
    for (const entry of byVillage.values()) {
      const f = entry.FFAS?.constraint_class, d = entry.DIS?.constraint_class;
      if (!f || !d) continue;
      table[f] = table[f] ?? {};
      table[f][d] = (table[f][d] ?? 0) + 1;
    }
    return table;
  }, [byVillage]);
}
