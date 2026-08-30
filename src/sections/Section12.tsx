import { AppSection } from '../components/layout/AppSection';
import { useAsync } from '../lib/useAsync';
import { loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import './sections.css';

const SOURCES = [
  { dataset: 'PODES 2024', produsen: 'Badan Pusat Statistik', tahun: '2024', resolusi: 'desa/kelurahan', diseminasi: 'agregat desa', digunakan: 'desa/kelurahan', lisensi: 'BPS — akses terbatas, agregat dapat didiseminasikan' },
  { dataset: 'DEMNAS', produsen: 'Badan Informasi Geospasial', tahun: '2022', resolusi: '0,27 arcsecond (~8,3 m)', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'CC BY 4.0' },
  { dataset: 'VIIRS Nighttime Lights', produsen: 'NOAA / Earth Observation Group', tahun: '2023', resolusi: '~500 m', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'Terbuka untuk riset' },
  { dataset: 'Sentinel-2', produsen: 'European Space Agency / Copernicus', tahun: '2023', resolusi: '10 m', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'Copernicus open licence' },
  { dataset: 'OpenStreetMap — jaringan jalan', produsen: 'Kontributor OpenStreetMap', tahun: '2024', resolusi: 'segmen jalan', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'ODbL' },
  { dataset: 'Batas administrasi desa (RBI)', produsen: 'Badan Informasi Geospasial / BPS', tahun: '2023', resolusi: 'desa/kelurahan', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'BIG / BPS' },
];

export function Section12() {
  const paper = useAsync(loadPaperResults, []);
  if (paper.loading) return <AppSection id="batas-tafsir" number="12" title="Batas tafsir"><Skeleton /></AppSection>;
  if (!paper.data) return <AppSection id="batas-tafsir" number="12" title="Batas tafsir"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  return (
    <AppSection id="batas-tafsir" number="12" title="Batas tafsir">
      <div className="limitation-grid">
        {paper.data.limitations.map((l) => (
          <div key={l.title} className="limitation-card">
            <strong>{l.title}</strong>
            <p className="copy-block" style={{ marginTop: 4 }}>{l.body}</p>
          </div>
        ))}
      </div>

      <div className="subpanel">
        <span className="subpanel-title">Uji ketahanan</span>
        <ul className="condition-list">
          {paper.data.robustness_checks.map((r) => (
            <li key={r.label}><strong>{r.label}.</strong> {r.detail}</li>
          ))}
        </ul>
      </div>

      <div className="subpanel">
        <span className="subpanel-title">Sumber data</span>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Dataset</th><th>Produsen</th><th>Tahun</th><th>Resolusi</th><th>Tingkat diseminasi</th><th>Digunakan pada level</th><th>Lisensi</th></tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.dataset}>
                  <td>{s.dataset}</td><td>{s.produsen}</td><td>{s.tahun}</td><td>{s.resolusi}</td>
                  <td>{s.diseminasi}</td><td>{s.digunakan}</td><td>{s.lisensi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="copy-block" style={{ marginTop: 'var(--space-5)' }}>
        Dashboard ini membaca hasil yang dihitung sepenuhnya di luar aplikasi. Tidak ada estimasi statistik yang
        dijalankan di dalam dashboard.
      </p>
    </AppSection>
  );
}
