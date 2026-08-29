import { useVizConfig } from '../../context/VizConfigContext';
import { navigate, routeHref, type Mode } from '../../lib/router';
import './layout.css';

export function Header({ mode, onDownload, onAbout }: { mode: Mode; onDownload: () => void; onAbout: () => void }) {
  const config = useVizConfig();
  return (
    <header className="app-header">
      <div className="app-header-title">
        <span className="eyebrow">Terrain as a Barrier</span>
        <span className="app-header-sub">Hambatan geografis atas akses keuangan digital di DIY</span>
      </div>
      <nav className="mode-switch" aria-label="Pilih mode">
        <a
          href={routeHref('bukti', 'temuan-utama')}
          className={mode === 'bukti' ? 'mode-btn active' : 'mode-btn'}
          onClick={(e) => { e.preventDefault(); navigate('bukti', 'temuan-utama'); }}
        >
          Bukti
        </a>
        <a
          href={routeHref('sasaran', 'daftar-prioritas')}
          className={mode === 'sasaran' ? 'mode-btn active' : 'mode-btn'}
          onClick={(e) => { e.preventDefault(); navigate('sasaran', 'daftar-prioritas'); }}
        >
          Sasaran
        </a>
      </nav>
      <div className="app-header-actions">
        <button className="link-btn" onClick={onDownload}>Unduh data</button>
        <button className="link-btn" onClick={onAbout}>Tentang</button>
      </div>
      {config?.version.placeholder && (
        <div className="placeholder-banner">
          Mode pratinjau — seluruh nilai pada dasbor ini adalah data placeholder untuk pengembangan antarmuka, termasuk FFAS yang menurut spesifikasi seharusnya menunggu konstruksi final.
        </div>
      )}
    </header>
  );
}
