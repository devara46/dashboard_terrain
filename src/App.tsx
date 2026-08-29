import { useState } from 'react';
import { Header } from './components/layout/Header';
import { PanelIndex } from './components/layout/PanelIndex';
import { Modal } from './components/common/Modal';
import { VizConfigProvider, useVizConfig } from './context/VizConfigContext';
import { BuktiMode } from './panels/bukti/BuktiMode';
import { SasaranMode } from './panels/sasaran/SasaranMode';
import { useHashRoute, BUKTI_PANELS, SASARAN_PANELS } from './lib/router';
import './styles/tokens.css';
import './components/layout/layout.css';

const DATA_FILES = [
  'villages_master.csv', 'villages_geography.csv', 'villages_outcomes.csv', 'villages_demand.csv',
  'villages_nonfarm_components.csv', 'villages_typology.csv', 'villages_decomposition.csv',
  'villages_patterns.csv', 'villages_policy.csv', 'lookup_categories.csv', 'lookup_labels.csv',
  'agg_kabupaten.csv', 'summary_headline.json', 'villages_geom.json', 'viz_config.json',
];

export default function App() {
  const route = useHashRoute();
  const [modal, setModal] = useState<'download' | 'about' | null>(null);

  return (
    <VizConfigProvider>
      <Header mode={route.mode} onDownload={() => setModal('download')} onAbout={() => setModal('about')} />
      <div className="app-body">
        <PanelIndex
          mode={route.mode}
          panels={route.mode === 'bukti' ? BUKTI_PANELS : SASARAN_PANELS}
          active={route.mode === 'sasaran' && route.panel === 'desa' ? 'daftar-prioritas' : route.panel}
          onNavigate={() => { /* hash change already drives re-render */ }}
        />
        {route.mode === 'bukti'
          ? <BuktiMode activePanel={route.panel} />
          : <SasaranMode activePanel={route.panel} param={route.param} />}
      </div>
      <Footer />
      {modal === 'download' && (
        <Modal title="Unduh data" onClose={() => setModal(null)}>
          <p>Seluruh berkas mengikuti kontrak data pada bagian 12 spesifikasi versi 2.</p>
          <ul>
            {DATA_FILES.map((f) => (
              <li key={f}><a href={`${import.meta.env.BASE_URL}data/${f}`} download>{f}</a></li>
            ))}
          </ul>
        </Modal>
      )}
      {modal === 'about' && (
        <Modal title="Tentang dasbor" onClose={() => setModal(null)}>
          <AboutBody />
        </Modal>
      )}
    </VizConfigProvider>
  );
}

function AboutBody() {
  const config = useVizConfig();
  return (
    <>
      <p>
        Dasbor ini adalah artefak suplementer untuk kertas kerja <em>Terrain as a Barrier: Geographic Constraints
        on Digital Financial Access at the Village Level in DIY</em>. Aplikasi statis, tanpa server dan tanpa
        estimasi saat runtime — seluruh perhitungan dilakukan secara luring dan dimuat dari berkas data tetap.
      </p>
      <p>
        Mode <strong>Bukti</strong> menyajikan klasifikasi deskriptif dan diagnostik dari dekomposisi kesenjangan
        pasokan. Mode <strong>Sasaran</strong> menyajikan daftar prioritas desa.
      </p>
      {config && (
        <p className="data-face">
          Versi {config.version.dashboard_version} · data dibangun {config.version.data_build_date}
        </p>
      )}
    </>
  );
}

function Footer() {
  const config = useVizConfig();
  return (
    <footer className="app-footer">
      <span>
        {config ? `Versi ${config.version.dashboard_version} · data dibangun ${config.version.data_build_date}` : ''}
      </span>
      <span>Terrain as a Barrier — dasbor suplementer, YES 2026.</span>
    </footer>
  );
}
