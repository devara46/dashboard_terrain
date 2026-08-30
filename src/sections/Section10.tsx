import { AppSection } from '../components/layout/AppSection';
import { NestedSets } from '../components/charts/NestedSets';
import { useAsync } from '../lib/useAsync';
import { loadPaperResults, loadSummaryHeadline } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtCount } from '../lib/format';
import './sections.css';

export function Section10() {
  const paper = useAsync(loadPaperResults, []);
  const summary = useAsync(loadSummaryHeadline, []);

  const loading = paper.loading || summary.loading;
  if (loading) return <AppSection id="terkendala-medan" number="10" title="Sebaran desa yang terkendala medan"><Skeleton /></AppSection>;
  if (!paper.data || !summary.data) return <AppSection id="terkendala-medan" number="10" title="Sebaran desa yang terkendala medan"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  const c = paper.data.terrain_dominant_counts;

  return (
    <AppSection id="terkendala-medan" number="10" title="Sebaran desa yang terkendala medan">
      <NestedSets total={summary.data.n_villages} disConstrained={c.dis} bothConstrained={c.ffas} />
      <p className="data-face" style={{ textAlign: 'center' }}>
        {fmtCount(c.dis)} desa terkendala medan pada kanal digital. {fmtCount(c.ffas)} di antaranya juga terkendala
        medan pada kanal keuangan formal. {fmtCount(c.ffas_only)} desa terkendala medan hanya pada kanal keuangan
        formal.
      </p>

      <div className="notice-bar" style={{ marginTop: 'var(--space-4)' }}>
        Komponen medan dalam dekomposisi ini dihitung menggunakan koefisien Stage 2. Diagnosis ini memetakan
        sebaran spasial dari mekanisme yang telah diestimasi, bukan konfirmasi yang berdiri sendiri.
      </div>
      <div className="notice-bar" style={{ marginTop: 'var(--space-2)' }}>
        Ketiadaan label terkendala medan tidak berarti medan tidak berpengaruh. Klasifikasi hanya menyatakan
        apakah komponen medan lebih dominan daripada komponen residual, dengan dukungan interval bootstrap 90
        persen atas 1.000 replikasi.
      </div>
    </AppSection>
  );
}
