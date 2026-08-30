import { useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { DecompositionBar } from '../components/charts/DecompositionBar';
import { useAsync } from '../lib/useAsync';
import { loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtIndex } from '../lib/format';
import './sections.css';

export function Section8() {
  const paper = useAsync(loadPaperResults, []);
  const [rawScale, setRawScale] = useState(false);

  if (paper.loading) return <AppSection id="dua-kanal" number="8" title="Perbandingan sensitivitas kedua kanal"><Skeleton /></AppSection>;
  if (!paper.data) return <AppSection id="dua-kanal" number="8" title="Perbandingan sensitivitas kedua kanal"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  const est = paper.data.two_channel_estimate;

  return (
    <AppSection id="dua-kanal" number="8" title="Perbandingan sensitivitas kedua kanal">
      <h3 className="hero-headline" style={{ fontSize: 'var(--step-3)' }}>Digitalisasi tidak melewati hambatan geografis.</h3>
      <p className="hero-subhead" style={{ fontSize: 'var(--step-1)' }}>
        Pada skala simpangan baku yang sama, pengaruh aksesibilitas fisik terhadap infrastruktur digital justru
        lebih besar daripada terhadap akses keuangan formal. Selisihnya sebesar {fmtIndex(est.difference, 3, true)}{' '}
        dengan p = {fmtIndex(est.anderson_rubin_p, 4)}, dan seluruh confidence set 95 persen berada di atas nol.
      </p>

      <div className="toggle-row">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--step-0)' }}>
          <input type="checkbox" checked={rawScale} onChange={(e) => setRawScale(e.target.checked)} />
          Tampilkan skala asli
        </label>
      </div>
      {rawScale ? (
        <p className="notice-bar">
          Pada skala asli, kedua koefisien tidak dapat dibandingkan karena FFAS dan DIS memiliki satuan yang
          berbeda. Perbandingan baru sah setelah keduanya dinyatakan dalam simpangan baku.
        </p>
      ) : (
        <>
          <p className="chart-axis-label">Yang diprediksi leapfrogging: sensitivitas kanal digital lebih rendah</p>
          <p className="chart-axis-label" style={{ marginBottom: 'var(--space-2)' }}>Yang ditemukan: sensitivitas kanal digital lebih tinggi</p>
          <DecompositionBar
            width={600}
            rows={[
              { key: 'ffas', label: 'Akses keuangan formal', value: est.ffas.coef, ciLow: est.ffas.ci_lo, ciHigh: est.ffas.ci_hi, dominant: false },
              { key: 'dis', label: 'Infrastruktur digital', value: est.dis.coef, ciLow: est.dis.ci_lo, ciHigh: est.dis.ci_hi, dominant: true },
              { key: 'diff', label: 'Selisih (DIS − FFAS)', value: est.difference, ciLow: est.confidence_set.lo, ciHigh: est.confidence_set.hi, dominant: true },
            ]}
          />
        </>
      )}
    </AppSection>
  );
}
