import { PanelSection } from '../../components/layout/PanelSection';
import { useVizConfig } from '../../context/VizConfigContext';
import { Skeleton } from '../../components/common/Value';
import '../panels.css';

const SOURCES = [
  { dataset: 'PODES 2024', produsen: 'Badan Pusat Statistik', tahun: '2024', resolusi: 'desa/kelurahan', diseminasi: 'agregat desa', digunakan: 'desa/kelurahan', lisensi: 'BPS — akses terbatas, agregat dapat didiseminasikan', url: 'https://www.bps.go.id/' },
  { dataset: 'DEMNAS', produsen: 'Badan Informasi Geospasial', tahun: '2022', resolusi: '0,27 arcsecond (~8,3 m)', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'CC BY 4.0', url: 'https://tanahair.indonesia.go.id/demnas' },
  { dataset: 'VIIRS Nighttime Lights', produsen: 'NOAA / Earth Observation Group', tahun: '2023', resolusi: '~500 m', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'Terbuka untuk riset', url: 'https://eogdata.mines.edu/products/vnl/' },
  { dataset: 'Sentinel-2', produsen: 'European Space Agency / Copernicus', tahun: '2023', resolusi: '10 m', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'Copernicus open licence', url: 'https://dataspace.copernicus.eu/' },
  { dataset: 'OpenStreetMap — jaringan jalan', produsen: 'Kontributor OpenStreetMap', tahun: '2024', resolusi: 'segmen jalan', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'ODbL', url: 'https://www.openstreetmap.org/' },
  { dataset: 'Batas administrasi desa (RBI)', produsen: 'Badan Informasi Geospasial / BPS', tahun: '2023', resolusi: 'desa/kelurahan', diseminasi: 'terbuka', digunakan: 'desa/kelurahan', lisensi: 'BIG / BPS', url: 'https://www.bps.go.id/' },
];

export function PanelI() {
  const config = useVizConfig();
  if (!config) return <PanelSection id="batas-sumber" letter="I" title="Batas tafsir dan sumber data"><Skeleton /></PanelSection>;

  return (
    <PanelSection id="batas-sumber" letter="I" title="Batas tafsir dan sumber data">
      <div className="rule-block">{config.interpretive_boundary}</div>

      <div className="subpanel">
        <span className="subpanel-title">Sumber data</span>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dataset</th><th>Produsen</th><th>Tahun</th><th>Resolusi</th>
                <th>Tingkat diseminasi</th><th>Digunakan pada level</th><th>Lisensi</th><th>Tautan</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s, i) => (
                <tr key={i}>
                  <td>{s.dataset}</td><td>{s.produsen}</td><td>{s.tahun}</td><td>{s.resolusi}</td>
                  <td>{s.diseminasi}</td><td>{s.digunakan}</td><td>{s.lisensi}</td>
                  <td><a href={s.url} target="_blank" rel="noreferrer">tautan</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="copy-block" style={{ marginTop: 'var(--space-4)' }}>{config.sources_note}</p>
      </div>
    </PanelSection>
  );
}
