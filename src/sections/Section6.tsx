import { AppSection } from '../components/layout/AppSection';
import './sections.css';

export function Section6() {
  return (
    <AppSection id="pertanyaan-diuji" number="6" title="Pertanyaan yang diuji">
      <p className="copy-block">
        Layanan keuangan digital sering digambarkan mampu melewati hambatan geografis. Kantor cabang memerlukan
        jalan, sedangkan aplikasi tidak.
      </p>
      <p className="copy-block">
        Akan tetapi, infrastruktur digital juga memerlukan lokasi menara, backhaul, pasokan listrik, dan akses
        pemeliharaan.
      </p>
      <p className="copy-block">
        Apabila digitalisasi benar-benar melewati geografi, infrastruktur digital seharusnya kurang terikat pada
        aksesibilitas fisik dibandingkan akses keuangan formal.
      </p>
      <p className="copy-block">Penelitian ini menguji prediksi tersebut pada 438 desa dan kelurahan di DIY.</p>

      <svg viewBox="0 0 640 220" width="100%" style={{ maxWidth: 640, marginTop: 'var(--space-5)' }} className="diagram-figure" role="img" aria-label="Dua lintasan skematik: kantor cabang melalui medan, aplikasi diprediksi melintas langsung">
        <circle cx={50} cy={170} r={8} fill="var(--andesit)" />
        <text x={50} y={195} textAnchor="middle" className="chart-axis-label">Desa</text>
        <rect x={560} y={150} width={60} height={40} fill="none" stroke="var(--andesit)" strokeWidth={1.5} />
        <text x={590} y={205} textAnchor="middle" className="chart-axis-label">Layanan</text>

        <path d="M 58 165 Q 250 40 590 155" fill="none" stroke="var(--kontur)" strokeWidth={2} strokeDasharray="5 4" />
        <text x={320} y={55} textAnchor="middle" className="chart-axis-label">Prediksi leapfrogging (ketergantungan pada aksesibilitas lebih lemah)</text>

        <path d="M 58 172 C 150 175 180 130 250 130 C 320 130 350 175 420 175 C 480 175 510 160 585 158" fill="none" stroke="var(--telaga)" strokeWidth={2.5} />
        <text x={250} y={112} textAnchor="middle" className="chart-row-label" fontSize="0.75rem">Kantor cabang, mengikuti kontur medan</text>
      </svg>
    </AppSection>
  );
}
