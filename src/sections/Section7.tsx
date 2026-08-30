import { useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { ScatterFit } from '../components/charts/ScatterFit';
import { useAsync } from '../lib/useAsync';
import { loadVillagesJoined, loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtIndex } from '../lib/format';
import './sections.css';

export function Section7() {
  const villages = useAsync(loadVillagesJoined, []);
  const paper = useAsync(loadPaperResults, []);
  const [withinKabupaten, setWithinKabupaten] = useState(false);

  const loading = villages.loading || paper.loading;
  if (loading) return <AppSection id="medan-aksesibilitas" number="7" title="Keterjalan medan dan aksesibilitas fisik"><Skeleton /></AppSection>;
  if (!villages.data || !paper.data) {
    return <AppSection id="medan-aksesibilitas" number="7" title="Keterjalan medan dan aksesibilitas fisik"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;
  }

  const stats = paper.data.terrain_accessibility;
  const points = villages.data.map((v) => ({ x: v.TRI, y: v.PAI }));

  return (
    <AppSection id="medan-aksesibilitas" number="7" title="Keterjalan medan dan aksesibilitas fisik">
      <p className="copy-block">
        Keterjalan medan dan aksesibilitas fisik bergerak berlawanan arah, sebelum klasifikasi mana pun ditampilkan.
      </p>

      <div className="toggle-row">
        <div className="segmented">
          <button className={!withinKabupaten ? 'active' : ''} onClick={() => setWithinKabupaten(false)}>Gabungan DIY</button>
          <button className={withinKabupaten ? 'active' : ''} onClick={() => setWithinKabupaten(true)}>Dalam kabupaten</button>
        </div>
      </div>

      <ScatterFit points={points} xLabel="Keterjalan medan (TRI)" yLabel="Aksesibilitas fisik (PAI)" />

      {!withinKabupaten ? (
        <p className="copy-block">
          Korelasi Pearson {fmtIndex(stats.pearson_all_diy, 3, true)}, korelasi Spearman{' '}
          {fmtIndex(stats.spearman_all_diy, 3, true)} pada gabungan seluruh DIY.
        </p>
      ) : (
        <p className="copy-block">
          Korelasi parsial dalam kabupaten {fmtIndex(stats.partial_within_kabupaten, 3, true)}, menunjukkan hubungan
          tidak semata didorong oleh perbedaan antar-kabupaten. Regresi TRI terhadap PAI menghasilkan koefisien{' '}
          {fmtIndex(stats.tri_on_pai_coef, 3, true)} dengan p ≈ {fmtIndex(stats.tri_on_pai_p, 3)}.
        </p>
      )}

      <p className="data-face" style={{ color: 'var(--andesit-soft)' }}>
        F tahap pertama = {fmtIndex(stats.weak_instrument_f, 2)}
      </p>
    </AppSection>
  );
}
