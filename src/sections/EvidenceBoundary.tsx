import { navigate } from '../lib/router';
import '../components/layout/layout.css';

export function EvidenceBoundary() {
  return (
    <div className="evidence-boundary">
      <span className="evidence-boundary-label">Dasar bukti</span>
      <p>
        Bagian berikut menjelaskan dasar empiris klasifikasi di atas. Pembaca yang hanya memerlukan daftar
        prioritas tidak perlu melanjutkan.
      </p>
      <button className="link-btn" onClick={() => navigate('pertanyaan-diuji')}>Lihat dasar bukti</button>
    </div>
  );
}
