import { PanelSection } from '../../components/layout/PanelSection';
import { NestedSets } from '../../components/charts/NestedSets';
import { useAsync } from '../../lib/useAsync';
import { loadSummaryHeadline, loadAggKabupaten } from '../../lib/dataLoader';
import { Skeleton } from '../../components/common/Value';
import { fmtCount, fmtIndex } from '../../lib/format';
import '../panels.css';

export function PanelA() {
  const summary = useAsync(loadSummaryHeadline, []);
  const agg = useAsync(loadAggKabupaten, []);

  const loading = summary.loading || agg.loading;
  const s = summary.data;
  const kotaYogya = agg.data?.find((k) => k.kabupaten === 'YOGYAKARTA');
  const kotaYogyaTerrain = kotaYogya ? kotaYogya.n_ffas_terrain + kotaYogya.n_dis_terrain - kotaYogya.n_both_terrain : undefined;

  return (
    <PanelSection id="temuan-utama" letter="A" title="Temuan utama">
      <p className="eyebrow">Temuan utama</p>
      <h1 className="hero-headline">Medan mengikat kanal digital, bukan kanal keuangan formal.</h1>
      <p className="hero-subhead">
        Dari 438 desa dan kelurahan di DIY, medan menjadi komponen dominan kesenjangan pasokan pada {s?.n_dis_terrain ?? '…'} desa
        untuk infrastruktur digital, tetapi hanya pada {s?.n_ffas_terrain ?? '…'} desa untuk akses keuangan formal. Tidak ada satu pun
        desa yang terkendala medan pada kanal keuangan formal tanpa sekaligus terkendala medan pada kanal digital.
      </p>

      {loading && <Skeleton label="Memuat temuan utama…" />}
      {!loading && !s && <p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p>}

      {s && (
        <>
          <NestedSets total={s.n_villages} disConstrained={s.n_dis_terrain} bothConstrained={s.n_both_terrain} />
          <p className="data-face hero-wald">
            {fmtCount(s.n_dis_terrain)} desa terkendala medan pada kanal digital. {fmtCount(s.n_both_terrain)} di antaranya juga
            terkendala medan pada kanal keuangan formal. {fmtCount(s.n_ffas_only_terrain)} desa terkendala medan hanya pada kanal
            keuangan formal.
          </p>

          <div className="validation-strip">
            <ValidationTile value={fmtIndex(s.mean_tri_pct_dis_terrain, 1)} label="Rata-rata persentil keterjalan medan pada desa yang terkendala medan (kanal digital)" />
            <ValidationTile value={fmtIndex(s.mean_pai_pct_dis_terrain, 1)} label="Rata-rata persentil aksesibilitas fisik pada desa yang sama" />
            <ValidationTile value={kotaYogyaTerrain !== undefined ? fmtCount(kotaYogyaTerrain) : '…'} label="Desa di Kota Yogyakarta yang terkendala medan pada kanal mana pun" />
          </div>

          <div className="hero-bignum">
            <span className="hero-bignum-value">{fmtCount(s.n_immediate_priority)}</span>
            <span className="hero-bignum-label">desa dan kelurahan prioritas segera</span>
            <p className="copy-block" style={{ marginTop: 'var(--space-2)' }}>
              <strong>{fmtCount(s.n_dual_supply_priority)}</strong> di antaranya memerlukan penguatan pada kedua kanal sekaligus, dan{' '}
              <strong>{fmtCount(s.n_dual_supply_priority_gunungkidul)}</strong> dari {fmtCount(s.n_dual_supply_priority)} berada di
              Kabupaten Gunungkidul.
            </p>
          </div>
        </>
      )}
    </PanelSection>
  );
}

function ValidationTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="validation-tile">
      <span className="validation-tile-value data-face">{value}</span>
      <span className="validation-tile-label">{label}</span>
    </div>
  );
}
