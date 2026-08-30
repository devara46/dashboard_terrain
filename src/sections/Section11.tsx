import { AppSection } from '../components/layout/AppSection';
import { useAsync } from '../lib/useAsync';
import { loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtIndex } from '../lib/format';
import './sections.css';

function MirrorBar({ label, ffas, dis }: { label: string; ffas: number; dis: number }) {
  const max = Math.max(ffas, dis, 1);
  return (
    <div className="mirror-bar-row">
      <span className="chart-row-label mirror-bar-label">{label}</span>
      <div className="mirror-bar">
        <div className="mirror-bar-side">
          <div className="mirror-bar-fill ffas" style={{ width: `${(ffas / max) * 100}%` }} />
          <span className="data-face">{fmtIndex(ffas, 1)}%</span>
        </div>
        <div className="mirror-bar-side reverse">
          <div className="mirror-bar-fill dis" style={{ width: `${(dis / max) * 100}%` }} />
          <span className="data-face">{fmtIndex(dis, 1)}%</span>
        </div>
      </div>
    </div>
  );
}

export function Section11() {
  const paper = useAsync(loadPaperResults, []);
  if (paper.loading) return <AppSection id="mekanisme-keuangan" number="11" title="Mekanisme ekonomi pada kanal keuangan formal"><Skeleton /></AppSection>;
  if (!paper.data) return <AppSection id="mekanisme-keuangan" number="11" title="Mekanisme ekonomi pada kanal keuangan formal"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  const m = paper.data.mechanism_ffas;

  return (
    <AppSection id="mekanisme-keuangan" number="11" title="Mekanisme ekonomi pada kanal keuangan formal">
      <p className="copy-block">
        Basis ekonomi non-pertanian menjelaskan sebagian besar pengaruh aksesibilitas terhadap akses keuangan
        formal, jauh lebih besar daripada pengaruhnya terhadap infrastruktur digital.
      </p>

      <div className="mirror-bar-header">
        <span>Keuangan formal</span>
        <span>Digital</span>
      </div>
      <MirrorBar label="Basis ekonomi non-pertanian" ffas={m.nonfarm_base_pct} dis={m.nonfarm_base_pct_dis} />
      <MirrorBar label="Pergeseran mata pencaharian" ffas={m.livelihood_shift_pct} dis={m.livelihood_shift_pct_dis} />
      <p className="caption">Persentase menyatakan proporsi pengaruh aksesibilitas terhadap tiap kanal yang dijelaskan oleh mediator tersebut.</p>

      <div className="notice-bar" style={{ marginTop: 'var(--space-4)' }}>
        Mediator tidak diacak dan desain penelitian tidak memenuhi asumsi mediasi kausal penuh. Hasil ini
        merupakan diagnosis yang konsisten dengan mekanisme, bukan estimasi mediasi kausal.
      </div>
    </AppSection>
  );
}
