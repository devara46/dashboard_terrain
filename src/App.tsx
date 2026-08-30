import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Rail } from './components/layout/Rail';
import { Modal } from './components/common/Modal';
import { VizConfigProvider, useVizConfig } from './context/VizConfigContext';
import { AllSections } from './sections/AllSections';
import { useHashRoute } from './lib/router';
import './styles/tokens.css';
import './components/layout/layout.css';

export default function App() {
  const route = useHashRoute();
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <VizConfigProvider>
      <Header onAbout={() => setAboutOpen(true)} />
      <div className="app-body">
        <Rail active={route.section} />
        <AllSections activeSection={route.section} />
      </div>
      <Footer />
      {aboutOpen && (
        <Modal title="Tentang dashboard" onClose={() => setAboutOpen(false)}>
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
        Dashboard ini adalah artefak suplementer untuk kertas kerja <em>Terrain as a Barrier: Geographic
        Constraints on Digital Financial Access at the Village Level in DIY</em>. Aplikasi statis, tanpa server dan
        tanpa estimasi saat runtime — seluruh perhitungan dilakukan secara luring dan dimuat dari berkas data tetap.
      </p>
      <p>
        Ringkasan menyajikan empat jenis keputusan atas 438 desa dan kelurahan. Dasar bukti menyajikan rangkaian
        temuan yang mendasari klasifikasi tersebut, dalam urutan yang sama dengan naskah kertas kerja.
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
      <span>Terrain as a Barrier — dashboard prioritas desa, YES 2026.</span>
    </footer>
  );
}
