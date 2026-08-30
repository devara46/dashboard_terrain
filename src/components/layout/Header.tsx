import { navigate } from '../../lib/router';
import './layout.css';

export function Header({ onAbout }: { onAbout: () => void }) {
  return (
    <header className="app-header">
      <div className="app-header-title">
        <span className="eyebrow">Terrain as a Barrier</span>
        <span className="app-header-sub">Dashboard prioritas desa untuk pengambil keputusan, DIY</span>
      </div>
      <div className="app-header-actions">
        <button className="link-btn" onClick={() => navigate('pertanyaan-diuji')}>Lihat dasar bukti</button>
        <button className="link-btn" onClick={onAbout}>Tentang</button>
      </div>
    </header>
  );
}
