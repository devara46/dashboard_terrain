import { useMemo } from 'react';
import { useAsync } from '../../lib/useAsync';
import {
  loadVillagesJoined, loadDecompositionByVillage, loadNonfarmByVillage, loadLookupCategories,
} from '../../lib/dataLoader';
import { StripPlot } from '../../components/charts/StripPlot';
import { DecompositionBar } from '../../components/charts/DecompositionBar';
import { ComponentProfileBars } from '../../components/charts/ComponentProfileBars';
import { Skeleton, IndexValue } from '../../components/common/Value';
import { fmtIndex, titleCase } from '../../lib/format';
import '../panels.css';

const REASON_IDN: Record<string, string> = {
  'Positive residual component dominates with bootstrap support': 'Komponen residual positif mendominasi, didukung selang kepercayaan bootstrap',
  'No positive supply gap': 'Tidak ada kesenjangan pasokan positif',
  'Positive terrain component dominates with bootstrap support': 'Komponen medan positif mendominasi, didukung selang kepercayaan bootstrap',
  'Dominance uncertain at configured bootstrap CI': 'Dominasi tidak pasti pada selang kepercayaan bootstrap yang digunakan',
  'Residual component offsets gap; terrain component is positive': 'Komponen residual mengimbangi kesenjangan; komponen medan bernilai positif',
};

export function PanelH({ village_id, onClose }: { village_id: string; onClose: () => void }) {
  const villages = useAsync(loadVillagesJoined, []);
  const decomposition = useAsync(loadDecompositionByVillage, []);
  const nonfarm = useAsync(loadNonfarmByVillage, []);
  const categories = useAsync(loadLookupCategories, []);

  const village = useMemo(() => villages.data?.find((v) => v.village_id === village_id), [villages.data, village_id]);
  const dec = decomposition.data?.get(village_id);
  const profile = nonfarm.data?.get(village_id);
  const category = categories.data?.find((c) => c.dashboard_category_idn === village?.dashboard_category_idn);

  const kabMedian = useMemo(() => {
    if (!villages.data || !village) return null;
    const inKab = villages.data.filter((v) => v.kabupaten === village.kabupaten);
    const med = (arr: number[]) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    return {
      tri: med(inKab.map((v) => v.TRI_percentile_DIY)), pai: med(inKab.map((v) => v.PAI_percentile_DIY)),
      ffas: med(inKab.map((v) => v.FFAS_std)), dis: med(inKab.map((v) => v.DIS_std)),
      di: med(inKab.map((v) => v.DI_std)), miFfas: med(inKab.map((v) => v.MI_FFAS)), miDis: med(inKab.map((v) => v.MI_DIS)),
    };
  }, [villages.data, village]);

  const loading = villages.loading || decomposition.loading || nonfarm.loading || categories.loading;

  return (
    <div className="card-overlay" role="dialog" aria-modal="true" aria-label="Kartu desa">
      <div className="card-overlay-backdrop" onClick={onClose} />
      <div className="card-panel">
        <button className="card-close" onClick={onClose} aria-label="Tutup kartu desa">×</button>
        {loading && <Skeleton />}
        {!loading && !village && <p className="notice-bar">Desa tidak ditemukan pada berkas data yang dimuat.</p>}
        {village && villages.data && kabMedian && (
          <>
            <div className="card-identity">
              <span className="eyebrow">{village.urban_rural}</span>
              <h2 className="place-name card-village-name">{titleCase(village.desa)}</h2>
              <p>{titleCase(village.kecamatan)}, {titleCase(village.kabupaten)}</p>
            </div>

            <div className="subpanel">
              <span className="subpanel-title">Posisi</span>
              <IndexRow label="Keterjalan medan (persentil)" raw={fmtIndex(village.TRI_percentile_DIY, 1)} all={villages.data.map((v) => v.TRI_percentile_DIY)} value={village.TRI_percentile_DIY} median={kabMedian.tri} />
              <IndexRow label="Aksesibilitas fisik (persentil)" raw={fmtIndex(village.PAI_percentile_DIY, 1)} all={villages.data.map((v) => v.PAI_percentile_DIY)} value={village.PAI_percentile_DIY} median={kabMedian.pai} />
              <IndexRow label="Akses keuangan formal (std)" raw={fmtIndex(village.FFAS_std, 3, true)} all={villages.data.map((v) => v.FFAS_std)} value={village.FFAS_std} median={kabMedian.ffas} />
              <IndexRow label="Infrastruktur digital (std)" raw={fmtIndex(village.DIS_std, 3, true)} all={villages.data.map((v) => v.DIS_std)} value={village.DIS_std} median={kabMedian.dis} />
              <IndexRow label="Indeks digital gabungan (std)" raw={fmtIndex(village.DI_std, 3, true)} all={villages.data.map((v) => v.DI_std)} value={village.DI_std} median={kabMedian.di} />
              <IndexRow label="Indeks pasar — keuangan formal" raw={fmtIndex(village.MI_FFAS, 3, true)} all={villages.data.map((v) => v.MI_FFAS)} value={village.MI_FFAS} median={kabMedian.miFfas} />
              <IndexRow label="Indeks pasar — infrastruktur digital" raw={fmtIndex(village.MI_DIS, 3, true)} all={villages.data.map((v) => v.MI_DIS)} value={village.MI_DIS} median={kabMedian.miDis} />
            </div>

            <div className="subpanel">
              <span className="subpanel-title">Kuadran</span>
              <p>Keuangan formal: <strong>{village.q_ffas_idn}</strong>. Infrastruktur digital: <strong>{village.q_dis_idn}</strong>.</p>
              <p className="caption" style={{ marginTop: 0 }}>{village.ChannelPattern}</p>
            </div>

            {dec?.FFAS && dec?.DIS && (
              <div className="subpanel">
                <span className="subpanel-title">Dekomposisi kesenjangan pasokan</span>
                <p className="chart-row-label">Kanal keuangan formal — {dec.FFAS.constraint_class_idn}</p>
                <DecompositionBar
                  width={420}
                  rows={[
                    { key: 't', label: 'Medan', value: dec.FFAS.gap_terrain, ciLow: dec.FFAS.ci_lo_terrain, ciHigh: dec.FFAS.ci_hi_terrain, dominant: dec.FFAS.constraint_class === 'Terrain-constrained' },
                    { key: 'r', label: 'Residual', value: dec.FFAS.gap_residual, ciLow: dec.FFAS.ci_lo_residual, ciHigh: dec.FFAS.ci_hi_residual, dominant: false },
                  ]}
                  dominanceMargin={dec.FFAS.dominance_margin}
                  supported={dec.FFAS.constraint_class !== 'No significant dominance'}
                />
                <p className="caption">{REASON_IDN[dec.FFAS.constraint_reason] ?? dec.FFAS.constraint_reason}</p>

                <p className="chart-row-label" style={{ marginTop: 'var(--space-4)' }}>Kanal infrastruktur digital — {dec.DIS.constraint_class_idn}</p>
                <DecompositionBar
                  width={420}
                  rows={[
                    { key: 't', label: 'Medan', value: dec.DIS.gap_terrain, ciLow: dec.DIS.ci_lo_terrain, ciHigh: dec.DIS.ci_hi_terrain, dominant: dec.DIS.constraint_class === 'Terrain-constrained' },
                    { key: 'r', label: 'Residual', value: dec.DIS.gap_residual, ciLow: dec.DIS.ci_lo_residual, ciHigh: dec.DIS.ci_hi_residual, dominant: false },
                  ]}
                  dominanceMargin={dec.DIS.dominance_margin}
                  supported={dec.DIS.constraint_class !== 'No significant dominance'}
                />
                <p className="caption">{REASON_IDN[dec.DIS.constraint_reason] ?? dec.DIS.constraint_reason}</p>
              </div>
            )}

            {profile && (
              <div className="subpanel">
                <span className="subpanel-title">Profil komponen ekonomi non-pertanian</span>
                <ComponentProfileBars values={profile} width={420} />
              </div>
            )}

            {category && (
              <div className="subpanel rule-block">
                <strong>{category.dashboard_category_idn}</strong> — {category.dashboard_policy_tier_idn}
                <p style={{ marginTop: 8 }}>{category.Stage5_Action_IDN}</p>
              </div>
            )}

            <p className="caption">Seluruh nilai pada kartu ini adalah indeks turunan dan hasil klasifikasi. Tidak ada catatan mentah dari PODES yang ditampilkan.</p>
          </>
        )}
      </div>
    </div>
  );
}

function IndexRow({ label, raw, all, value, median }: { label: string; raw: string; all: number[]; value: number; median: number }) {
  return (
    <div className="index-row">
      <span className="index-row-label">{label}</span>
      <span className="data-face">{raw}</span>
      <StripPlot allValues={all} value={value} median={median} width={140} height={16} />
    </div>
  );
}
