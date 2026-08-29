import { useMemo, useState } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { Choropleth } from '../../components/map/Choropleth';
import { StripPlot } from '../../components/charts/StripPlot';
import { useAsync } from '../../lib/useAsync';
import {
  loadVillagesGeom, loadVillagesJoined, loadDecompositionByVillage, loadLookupCategories, loadVizConfig,
} from '../../lib/dataLoader';
import { Skeleton, IndexValue } from '../../components/common/Value';
import { fmtCount, titleCase } from '../../lib/format';
import { navigate } from '../../lib/router';
import '../panels.css';
import '../../components/common/common.css';

interface Filters {
  kabupaten: Set<string>;
  category: Set<string>;
  immediateOnly: boolean;
  priorityChannel: Set<string>;
  terrainPattern: Set<string>;
  demandLevel: 'all' | 'Tinggi' | 'Rendah';
  urbanRural: 'all' | 'Perkotaan' | 'Perdesaan';
  divergentOnly: boolean;
}
const EMPTY_FILTERS: Filters = {
  kabupaten: new Set(), category: new Set(), immediateOnly: false, priorityChannel: new Set(),
  terrainPattern: new Set(), demandLevel: 'all', urbanRural: 'all', divergentOnly: false,
};

type SortKey = 'desa' | 'kecamatan' | 'kabupaten' | 'TRI_percentile_DIY' | 'PAI_percentile_DIY' | 'priority_order';

export function PanelG() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const decomposition = useAsync(loadDecompositionByVillage, []);
  const categories = useAsync(loadLookupCategories, []);
  const config = useAsync(loadVizConfig, []);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }[]>([{ key: 'priority_order', dir: 1 }, { key: 'TRI_percentile_DIY', dir: -1 }]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const categoryColor = useMemo(() => new Map((categories.data ?? []).map((c) => [c.dashboard_category_idn, c.category_color_hex])), [categories.data]);
  // Stable array references matter here, not just avoiding recomputation:
  // StripPlot's shared-background cache is keyed by array identity, so a
  // fresh array every render (e.g. from hover state changes) would defeat
  // the cache and rebuild all 438 background dots per row again.
  const triAll = useMemo(() => (villages.data ?? []).map((v) => v.TRI_percentile_DIY), [villages.data]);
  const paiAll = useMemo(() => (villages.data ?? []).map((v) => v.PAI_percentile_DIY), [villages.data]);
  const villageById = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);

  const filtered = useMemo(() => {
    if (!villages.data) return [];
    return villages.data.filter((v) => {
      if (filters.kabupaten.size && !filters.kabupaten.has(v.kabupaten)) return false;
      if (filters.category.size && !filters.category.has(v.dashboard_category_idn)) return false;
      if (filters.immediateOnly && !v.immediate_priority) return false;
      if (filters.priorityChannel.size && !filters.priorityChannel.has(v.priority_channel)) return false;
      if (filters.terrainPattern.size && !filters.terrainPattern.has(v.TerrainPattern)) return false;
      if (filters.demandLevel !== 'all' && v.demand_level_idn !== filters.demandLevel) return false;
      if (filters.urbanRural !== 'all' && v.urban_rural !== filters.urbanRural) return false;
      if (filters.divergentOnly && !v.channel_divergent) return false;
      return true;
    });
  }, [villages.data, filters]);

  // O(1) membership for the companion map's dimIf, checked once per feature
  // per render (438 features) — a .some() scan there would be O(n^2).
  const filteredIds = useMemo(() => new Set(filtered.map((v) => v.village_id)), [filtered]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      for (const { key, dir } of sort) {
        const av = a[key], bv = b[key];
        if (av === bv) continue;
        if (typeof av === 'string') return av.localeCompare(bv as string) * dir;
        return ((av as number) - (bv as number)) * dir;
      }
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s[0]?.key === key ? [{ key, dir: (s[0].dir * -1) as 1 | -1 }] : [{ key, dir: 1 }]));
  }

  function exportCsv() {
    if (!config.data || !decomposition.data) return;
    const header = `# Terrain as a Barrier — Dasbor DIY | versi ${config.data.version.dashboard_version} | data dibangun ${config.data.version.data_build_date} | diunduh ${new Date().toISOString().slice(0, 10)}`;
    const cols = ['desa', 'kecamatan', 'kabupaten', 'TRI_percentile_DIY', 'PAI_percentile_DIY', 'constraint_ffas', 'constraint_dis', 'dashboard_category_idn'];
    const lines = [header, cols.join(',')];
    sorted.forEach((v) => {
      const dec = decomposition.data!.get(v.village_id);
      const row = [
        v.desa, v.kecamatan, v.kabupaten, String(v.TRI_percentile_DIY), String(v.PAI_percentile_DIY),
        dec?.FFAS?.constraint_class_idn ?? '', dec?.DIS?.constraint_class_idn ?? '', v.dashboard_category_idn,
      ];
      lines.push(row.map((f) => (/[,"]/.test(f) ? `"${f.replace(/"/g, '""')}"` : f)).join(','));
    });
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'daftar_prioritas_diy.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const loading = geom.loading || villages.loading || decomposition.loading || categories.loading || config.loading;
  if (loading) return <PanelSection id="daftar-prioritas" letter="G" title="Daftar prioritas"><Skeleton /></PanelSection>;
  if (!geom.data || !villages.data || !decomposition.data || !categories.data) {
    return <PanelSection id="daftar-prioritas" letter="G" title="Daftar prioritas"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;
  }

  const kabupatenOptions = [...new Set(villages.data.map((v) => v.kabupaten))].sort();
  const immediateCats = categories.data.filter((c) => c.priority_order === 1);
  const laterCats = categories.data.filter((c) => c.priority_order !== 1).sort((a, b) => a.priority_order - b.priority_order);

  const chips: { label: string; onRemove: () => void }[] = [];
  filters.kabupaten.forEach((k) => chips.push({ label: k, onRemove: () => setFilters((f) => ({ ...f, kabupaten: without(f.kabupaten, k) })) }));
  filters.category.forEach((c) => chips.push({ label: c, onRemove: () => setFilters((f) => ({ ...f, category: without(f.category, c) })) }));
  if (filters.immediateOnly) chips.push({ label: 'Prioritas segera', onRemove: () => setFilters((f) => ({ ...f, immediateOnly: false })) });
  filters.priorityChannel.forEach((c) => chips.push({ label: `Kanal: ${c}`, onRemove: () => setFilters((f) => ({ ...f, priorityChannel: without(f.priorityChannel, c) })) }));
  filters.terrainPattern.forEach((p) => chips.push({ label: p, onRemove: () => setFilters((f) => ({ ...f, terrainPattern: without(f.terrainPattern, p) })) }));
  if (filters.demandLevel !== 'all') chips.push({ label: `Permintaan: ${filters.demandLevel}`, onRemove: () => setFilters((f) => ({ ...f, demandLevel: 'all' })) });
  if (filters.urbanRural !== 'all') chips.push({ label: filters.urbanRural, onRemove: () => setFilters((f) => ({ ...f, urbanRural: 'all' })) });
  if (filters.divergentOnly) chips.push({ label: 'Divergen antar kanal', onRemove: () => setFilters((f) => ({ ...f, divergentOnly: false })) });

  return (
    <PanelSection id="daftar-prioritas" letter="G" title="Daftar prioritas">
      <div className="rule-block">
        <p style={{ marginTop: 0 }}>
          Data yang dimuat sudah membawa klasifikasi lengkap lima kategori dengan urutan prioritas. Dasbor ini
          menampilkan klasifikasi tersebut, bukan menyusun aturan baru.
        </p>
        <p><strong>Prioritas segera ({fmtCount(immediateCats.reduce((a, c) => a + c.n_villages, 0))} desa)</strong></p>
        <ul style={{ marginTop: 4 }}>
          {immediateCats.map((c) => (
            <li key={c.category_key}>{c.dashboard_category_idn} — {c.dashboard_policy_tier_idn} ({fmtCount(c.n_villages)})</li>
          ))}
        </ul>
        <ul>
          {laterCats.map((c) => (
            <li key={c.category_key}>{c.dashboard_category_idn} — {c.dashboard_policy_tier_idn} ({fmtCount(c.n_villages)})</li>
          ))}
        </ul>
      </div>

      <div className="filters-block">
        <FilterGroup label="Kabupaten/Kota">
          {kabupatenOptions.map((k) => (
            <label key={k} className="filter-checkbox">
              <input type="checkbox" checked={filters.kabupaten.has(k)} onChange={() => setFilters((f) => ({ ...f, kabupaten: toggle(f.kabupaten, k) }))} />
              {titleCase(k)}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup label="Kategori kebijakan">
          {categories.data.map((c) => (
            <label key={c.category_key} className="filter-checkbox">
              <input type="checkbox" checked={filters.category.has(c.dashboard_category_idn)} onChange={() => setFilters((f) => ({ ...f, category: toggle(f.category, c.dashboard_category_idn) }))} />
              {c.dashboard_category_idn}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup label="Kanal prioritas">
          {['NONE', 'BOTH', 'FFAS', 'DIS'].map((c) => (
            <label key={c} className="filter-checkbox">
              <input type="checkbox" checked={filters.priorityChannel.has(c)} onChange={() => setFilters((f) => ({ ...f, priorityChannel: toggle(f.priorityChannel, c) }))} />
              {c}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup label="Pola kendala medan">
          {['Neither channel terrain-constrained', 'DIS terrain-constrained only', 'Both channels terrain-constrained'].map((p) => (
            <label key={p} className="filter-checkbox">
              <input type="checkbox" checked={filters.terrainPattern.has(p)} onChange={() => setFilters((f) => ({ ...f, terrainPattern: toggle(f.terrainPattern, p) }))} />
              {p === 'Neither channel terrain-constrained' ? 'Tidak ada kanal terkendala medan' : p === 'DIS terrain-constrained only' ? 'Hanya kanal digital' : 'Kedua kanal'}
            </label>
          ))}
        </FilterGroup>
        <div className="filter-group">
          <span className="filter-group-label">Tingkat permintaan</span>
          <div className="segmented">
            <button className={filters.demandLevel === 'all' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, demandLevel: 'all' }))}>Semua</button>
            <button className={filters.demandLevel === 'Tinggi' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, demandLevel: 'Tinggi' }))}>Tinggi</button>
            <button className={filters.demandLevel === 'Rendah' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, demandLevel: 'Rendah' }))}>Rendah</button>
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-group-label">Perkotaan / perdesaan</span>
          <div className="segmented">
            <button className={filters.urbanRural === 'all' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, urbanRural: 'all' }))}>Semua</button>
            <button className={filters.urbanRural === 'Perkotaan' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, urbanRural: 'Perkotaan' }))}>Perkotaan</button>
            <button className={filters.urbanRural === 'Perdesaan' ? 'active' : ''} onClick={() => setFilters((f) => ({ ...f, urbanRural: 'Perdesaan' }))}>Perdesaan</button>
          </div>
        </div>
        <label className="filter-checkbox">
          <input type="checkbox" checked={filters.immediateOnly} onChange={(e) => setFilters((f) => ({ ...f, immediateOnly: e.target.checked }))} />
          Prioritas segera
        </label>
        <label className="filter-checkbox">
          <input type="checkbox" checked={filters.divergentOnly} onChange={(e) => setFilters((f) => ({ ...f, divergentOnly: e.target.checked }))} />
          Divergen antar kanal
        </label>
      </div>

      {chips.length > 0 && (
        <div className="chip-row">
          {chips.map((c, i) => <span key={i} className="chip">{c.label}<button onClick={c.onRemove} aria-label="Hapus filter">×</button></span>)}
          <button className="link-btn" onClick={() => setFilters(EMPTY_FILTERS)}>Bersihkan semua</button>
        </div>
      )}

      <p className="data-face" style={{ marginTop: 'var(--space-2)' }}>
        Menampilkan {fmtCount(sorted.length)} dari {fmtCount(villages.data.length)} desa dan kelurahan
      </p>

      <div className="table-map-layout">
        <div className="table-wrap">
          {sorted.length === 0 ? (
            <p className="notice-bar">Tidak ada desa yang memenuhi kombinasi filter ini. Kurangi satu filter untuk melihat hasil.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('desa')}>Desa/Kelurahan</th>
                  <th onClick={() => toggleSort('kecamatan')}>Kecamatan</th>
                  <th onClick={() => toggleSort('kabupaten')}>Kabupaten/Kota</th>
                  <th onClick={() => toggleSort('TRI_percentile_DIY')}>Keterjalan (persentil)</th>
                  <th onClick={() => toggleSort('PAI_percentile_DIY')}>Aksesibilitas (persentil)</th>
                  <th>Kendala FFAS</th>
                  <th>Kendala DIS</th>
                  <th onClick={() => toggleSort('priority_order')}>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v) => {
                  const dec = decomposition.data!.get(v.village_id);
                  return (
                    <tr
                      key={v.village_id}
                      onMouseEnter={() => setHovered(v.village_id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(v.village_id)}
                      style={{ background: selected === v.village_id ? 'var(--kapur-raised)' : undefined, cursor: 'pointer' }}
                    >
                      <td className="place-name">
                        <a href={`#/sasaran/desa/${v.village_id}`} onClick={(e) => { e.preventDefault(); navigate('sasaran', 'desa', v.village_id); }}>{titleCase(v.desa)}</a>
                      </td>
                      <td>{titleCase(v.kecamatan)}</td>
                      <td>{titleCase(v.kabupaten)}</td>
                      <td className="num"><IndexValue value={v.TRI_percentile_DIY} dp={1} /> <StripPlot allValues={triAll} value={v.TRI_percentile_DIY} width={60} height={12} /></td>
                      <td className="num"><IndexValue value={v.PAI_percentile_DIY} dp={1} /> <StripPlot allValues={paiAll} value={v.PAI_percentile_DIY} width={60} height={12} /></td>
                      <td><ConstraintChip label={dec?.FFAS?.constraint_class_idn} /></td>
                      <td><ConstraintChip label={dec?.DIS?.constraint_class_idn} /></td>
                      <td>
                        <span className="tier-chip" style={{ background: categoryColor.get(v.dashboard_category_idn), color: '#fff', borderColor: categoryColor.get(v.dashboard_category_idn) }}>
                          {v.dashboard_category_idn}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="companion-map">
          <Choropleth
            geom={geom.data}
            width={340} height={460}
            hoveredId={hovered ?? selected}
            onHover={setHovered}
            onSelect={setSelected}
            dimIf={(id) => !filteredIds.has(id)}
            colorFor={(id) => {
              const v = villageById.get(id);
              return v ? categoryColor.get(v.dashboard_category_idn) ?? '#cfcfc7' : '#cfcfc7';
            }}
          />
        </div>
      </div>

      <button className="link-btn" onClick={exportCsv} style={{ marginTop: 'var(--space-3)' }}>Unduh hasil filter (CSV)</button>
    </PanelSection>
  );
}

function ConstraintChip({ label }: { label?: string }) {
  if (!label) return <span className="missing">belum tersedia</span>;
  const color = label === 'Dominan Medan' ? 'var(--bukit)' : label === 'Dominan Residual / Non-Terrain' ? 'var(--kontur)' : 'var(--andesit-soft)';
  return <span className="chip" style={{ borderColor: color, color }}>{label}</span>;
}
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <span className="filter-group-label">{label}</span>
      <div className="filter-group-options">{children}</div>
    </div>
  );
}
function toggle<T>(set: Set<T>, v: T): Set<T> { const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); return n; }
function without<T>(set: Set<T>, v: T): Set<T> { const n = new Set(set); n.delete(v); return n; }
