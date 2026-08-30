import { AppSection } from '../components/layout/AppSection';
import { DecompositionBar } from '../components/charts/DecompositionBar';
import { useAsync } from '../lib/useAsync';
import { loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtIndex } from '../lib/format';
import './sections.css';

export function Section9() {
  const paper = useAsync(loadPaperResults, []);

  if (paper.loading) return <AppSection id="dimensi-kedua" number="9" title="Dependensi spasial antar-desa"><Skeleton /></AppSection>;
  if (!paper.data) return <AppSection id="dimensi-kedua" number="9" title="Dependensi spasial antar-desa"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  const sp = paper.data.spatial_dependency;

  return (
    <AppSection id="dimensi-kedua" number="9" title="Dependensi spasial antar-desa">
      <p className="copy-block">
        Kanal digital lebih sensitif terhadap kondisi aksesibilitas di desa itu sendiri, tetapi tidak menunjukkan
        keterkaitan antar-desa yang lebih kuat. Hambatan digital dalam penelitian ini bersifat setempat, bukan
        bersifat jaringan.
      </p>
      <p className="copy-block">
        Selisih rho sebesar {fmtIndex(sp.difference, 4, true)} dengan interval 90 persen dari{' '}
        {fmtIndex(sp.ci90.lo, 3, true)} sampai {fmtIndex(sp.ci90.hi, 3, true)}. Karena interval tersebut memuat nol,
        besar dependensi spasial kedua kanal tidak dapat dibedakan secara statistik.
      </p>

      <DecompositionBar
        width={600}
        rows={[
          { key: 'ffas', label: 'Rho — keuangan formal', value: sp.rho_ffas, ciLow: sp.rho_ffas, ciHigh: sp.rho_ffas, dominant: false },
          { key: 'dis', label: 'Rho — digital', value: sp.rho_dis, ciLow: sp.rho_dis, ciHigh: sp.rho_dis, dominant: false },
          { key: 'diff', label: 'Selisih (digital − keuangan formal)', value: sp.difference, ciLow: sp.ci90.lo, ciHigh: sp.ci90.hi, dominant: false },
        ]}
      />
      <p className="caption">
        Baris pertama dan kedua adalah titik estimasi rho per kanal, tanpa selang. Baris ketiga, selisihnya, adalah
        satu-satunya baris dengan selang kepercayaan 90 persen yang dilaporkan. Matriks bobot: ketetanggaan {sp.weight_matrix}.
      </p>
    </AppSection>
  );
}
