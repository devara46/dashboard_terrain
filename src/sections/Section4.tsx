import { useMemo, useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { Choropleth } from '../components/map/Choropleth';
import { StripPlot } from '../components/charts/StripPlot';
import { useAsync } from '../lib/useAsync';
import { loadVillagesGeom, loadVillagesJoined, loadDecompositionByVillage } from '../lib/dataLoader';
import { titleCase, fmtIndex } from '../lib/format';
import { villageTerm, districtTerm, kabupatenLabel } from '../lib/adminTerms';
import { Skeleton } from '../components/common/Value';
import { navigate } from '../lib/router';
import type { VillageJoined, DecompositionByChannel } from '../lib/dataLoader';
import './sections.css';

const DEFAULT_VILLAGE_ID = '3403120004'; // Tegalrejo, Gedangsari, Gunungkidul — nominated worked example, pending confirmation (open item 5)

function channelClause(channel: 'keuangan formal' | 'digital', constraintClass?: string): string {
  if (constraintClass === 'Terrain-constrained') return `pada kanal ${channel}, komponen medan mendominasi kesenjangan pasokan`;
  if (constraintClass === 'Residual-constrained') return `pada kanal ${channel}, komponen residual mendominasi dan sumbernya bukan kondisi medan`;
  return `pada kanal ${channel}, dominasi antara komponen medan dan residual belum dapat dibedakan secara meyakinkan`;
}

function actionParagraph(v: VillageJoined, dec?: DecompositionByChannel): string {
  const verb = v.action.verb_idn;
  if (!dec?.FFAS || !dec?.DIS) return `**Keputusan: ${verb}.**`;
  const bothResidual = dec.FFAS.constraint_class === 'Residual-constrained' && dec.DIS.constraint_class === 'Residual-constrained';
  const bothTerrain = dec.FFAS.constraint_class === 'Terrain-constrained' && dec.DIS.constraint_class === 'Terrain-constrained';
  if (bothResidual) {
    return `**Keputusan: ${verb}.** Karena sumber kesenjangan pada kedua kanal bersifat residual dan bukan medan, verifikasi cakupan penyedia, desain layanan, dan kapasitas kelembagaan perlu mendahului belanja modal.`;
  }
  if (bothTerrain) {
    return `**Keputusan: ${verb}.** Karena sumber kesenjangan pada kedua kanal berasal dari kondisi medan, verifikasi lapangan atas kelayakan teknis perlu mendahului keputusan investasi.`;
  }
  const ffasClause = channelClause('keuangan formal', dec.FFAS.constraint_class);
  const disClause = channelClause('digital', dec.DIS.constraint_class);
  return `**Keputusan: ${verb}.** Diagnosis sumber kesenjangan berbeda pada kedua kanal: ${ffasClause}, sedangkan ${disClause}. Bentuk penanganan pada tiap kanal sebaiknya mengikuti diagnosis masing-masing, bukan disamakan.`;
}

export function Section4() {
  const geom = useAsync(loadVillagesGeom, []);
  const villages = useAsync(loadVillagesJoined, []);
  const decomposition = useAsync(loadDecompositionByVillage, []);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(DEFAULT_VILLAGE_ID);

  const byId = useMemo(() => new Map((villages.data ?? []).map((v) => [v.village_id, v])), [villages.data]);
  const results = useMemo(() => {
    if (!query.trim() || !villages.data) return [];
    const q = query.trim().toLowerCase();
    return villages.data.filter((v) => v.desa.toLowerCase().includes(q)).slice(0, 8);
  }, [query, villages.data]);

  const village = byId.get(selectedId);
  const dec = decomposition.data?.get(selectedId);

  const kabMedian = useMemo(() => {
    if (!villages.data || !village) return null;
    const inKab = villages.data.filter((v) => v.kabupaten === village.kabupaten);
    const med = (arr: number[]) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    return { tri: med(inKab.map((v) => v.TRI_percentile_DIY)), pai: med(inKab.map((v) => v.PAI_percentile_DIY)) };
  }, [villages.data, village]);

  const loading = geom.loading || villages.loading || decomposition.loading;
  if (loading) return <AppSection id="profil-desa" number="4" title="Profil desa"><Skeleton /></AppSection>;
  if (!geom.data || !villages.data || !village || !kabMedian) {
    return <AppSection id="profil-desa" number="4" title="Profil desa"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;
  }

  const vTerm = villageTerm(village.kabupaten);
  const dTerm = districtTerm(village.kabupaten);
  const brief = actionParagraph(village, dec);
  const [decisionLine, ...rest] = brief.split('** ');
  const decisionLabel = decisionLine.replace('**', '');
  const decisionRest = rest.join('** ');

  return (
    <AppSection id="profil-desa" number="4" title="Profil desa">
      <p className="panel-purpose">Dari band, ke kabupaten, ke satu desa.</p>

      <div className="search-row">
        <input
          type="search" placeholder="Cari kalurahan atau kelurahan" value={query}
          onChange={(e) => setQuery(e.target.value)} className="search-input"
        />
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((r) => (
              <li key={r.village_id}>
                <button onClick={() => { setSelectedId(r.village_id); setQuery(''); navigate('profil-desa', r.village_id); }}>
                  {titleCase(r.desa)}, {titleCase(r.kecamatan)}, {kabupatenLabel(r.kabupaten)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="two-col" style={{ marginTop: 'var(--space-4)' }}>
        <Choropleth
          geom={geom.data} width={420} height={420}
          onSelect={(id) => { setSelectedId(id); navigate('profil-desa', id); }}
          colorFor={(id) => byId.get(id)?.action.color ?? '#cfcfc7'}
          hoveredId={selectedId}
        />

        <div className="village-brief">
          <p className="place-name village-brief-name">
            <strong>{vTerm} {titleCase(village.desa)}</strong>, {dTerm} {titleCase(village.kecamatan)}, {kabupatenLabel(village.kabupaten)}.
          </p>
          <p className="copy-block">
            {vTerm} ini berada pada persentil ke-{fmtIndex(village.TRI_percentile_DIY, 0)} keterjalan medan dan
            persentil ke-{fmtIndex(village.PAI_percentile_DIY, 0)} aksesibilitas fisik di DIY.
          </p>
          <StripPlot allValues={villages.data.map((v) => v.TRI_percentile_DIY)} value={village.TRI_percentile_DIY} median={kabMedian.tri} width={260} height={16} />
          <p className="caption" style={{ marginTop: 4 }}>Posisi keterjalan medan terhadap distribusi DIY, median kabupaten ditandai.</p>
          <StripPlot allValues={villages.data.map((v) => v.PAI_percentile_DIY)} value={village.PAI_percentile_DIY} median={kabMedian.pai} width={260} height={16} />
          <p className="caption" style={{ marginTop: 4 }}>Posisi aksesibilitas fisik terhadap distribusi DIY, median kabupaten ditandai.</p>

          <p className="copy-block" style={{ marginTop: 'var(--space-3)' }}>
            Tingkat permintaan ekonomi: <strong>{village.demand_level_idn}</strong>. Kategori: <strong>{village.dashboard_category_idn}</strong>.
          </p>

          <p className="copy-block village-brief-decision">
            <strong>{decisionLabel}</strong> {decisionRest}
          </p>

          <p className="decision-block-actors">
            Aktor yang relevan untuk koordinasi: Bappeda DIY, KPw Bank Indonesia DIY, OJK DIY, Diskominfo DIY,
            Pemerintah {kabupatenLabel(village.kabupaten)}, Pemerintah {vTerm} {titleCase(village.desa)}.
          </p>
        </div>
      </div>
    </AppSection>
  );
}
