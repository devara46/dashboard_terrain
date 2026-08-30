import { useMemo } from 'react';
import { useAsync } from '../lib/useAsync';
import { loadLookupActionsPolicy, loadSummaryHeadline } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtCount } from '../lib/format';
import type { LookupActionPolicy, Band } from '../lib/types';
import './sections.css';

const BAND_ORDER: Band[] = ['A', 'B', 'C', 'D'];

export function Hero() {
  const actions = useAsync(loadLookupActionsPolicy, []);
  const summary = useAsync(loadSummaryHeadline, []);

  const byBand = useMemo(() => {
    const map = new Map<Band, LookupActionPolicy[]>();
    for (const a of actions.data ?? []) {
      const list = map.get(a.band) ?? [];
      list.push(a);
      map.set(a.band, list);
    }
    return map;
  }, [actions.data]);

  const loading = actions.loading || summary.loading;
  if (loading) return <div id="ringkasan" className="app-section"><Skeleton label="Memuat ringkasan…" /></div>;
  if (!actions.data || !summary.data) return <div id="ringkasan" className="app-section"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></div>;

  const total = summary.data.n_villages;

  return (
    <div id="ringkasan" className="app-section hero-section">
      <h1 className="hero-headline">
        {fmtCount(summary.data.n_immediate_priority)} dari {fmtCount(total)} desa dan kelurahan di DIY memerlukan
        penanganan ketersediaan layanan dalam waktu dekat.
      </h1>
      <p className="hero-subhead">
        Pada {fmtCount(summary.data.n_dual_supply_priority)} di antaranya, akses keuangan formal dan infrastruktur
        digital sama-sama tertinggal. Sebanyak {fmtCount(summary.data.n_dual_supply_priority_gunungkidul)} dari{' '}
        {fmtCount(summary.data.n_dual_supply_priority)} desa tersebut berada di Gunungkidul.
      </p>

      <div className="band-bar" role="img" aria-label="Distribusi 438 desa ke empat band keputusan">
        {BAND_ORDER.map((band) => {
          const cats = byBand.get(band) ?? [];
          const n = cats.reduce((a, c) => a + c.n, 0);
          const pct = (n / total) * 100;
          return (
            <div
              key={band}
              className={`band-bar-segment band-${band}`}
              style={{ width: `${pct}%`, background: cats[0]?.color }}
            >
              <span className="band-bar-label">{cats[0]?.band_idn}</span>
              <span className="band-bar-count data-face">{fmtCount(n)}</span>
            </div>
          );
        })}
      </div>

      <div className="decision-cards">
        {BAND_ORDER.map((band) => {
          const cats = byBand.get(band) ?? [];
          if (cats.length === 0) return null;
          const n = cats.reduce((a, c) => a + c.n, 0);
          const primary = [...cats].sort((a, b) => b.n - a.n)[0];
          const leads = [...new Set(cats.map((c) => c.lead_actor))];
          return (
            <div key={band} className="decision-card" style={{ borderTopColor: primary.color }}>
              <span className="decision-card-verb">
                {cats.map((c) => c.verb_idn).join(' · ')}
              </span>
              <span className="decision-card-count data-face">{fmtCount(n)} desa</span>
              <p className="decision-card-question">{primary.question_idn}</p>
              <p className="decision-card-lead">Pemrakarsa: {leads.join('; ')}</p>
            </div>
          );
        })}
      </div>

      <p className="copy-block hero-framing">
        Klasifikasi ini dihasilkan dari aturan yang telah ditetapkan atas data {fmtCount(total)} desa dan kelurahan,
        bukan dari model prediksi baru.
      </p>
      <div className="notice-bar hero-caution">
        Keempat kategori ini menunjukkan urutan penanganan, bukan besaran anggaran. Penelitian ini tidak menghitung
        biaya intervensi.
      </div>
    </div>
  );
}
