import { useMemo, useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { useAsync } from '../lib/useAsync';
import { loadVillagesJoined } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtCount, fmtIndex } from '../lib/format';
import { kabupatenLabel } from '../lib/adminTerms';
import type { Band } from '../lib/types';
import './sections.css';

const BAND_ORDER: Band[] = ['A', 'B', 'C', 'D'];
const KABUPATEN_ORDER = ['BANTUL', 'GUNUNGKIDUL', 'KULON PROGO', 'SLEMAN', 'YOGYAKARTA'];

// Naskah antarmuka dashboard, section 9 — one sentence per kabupaten,
// verbatim (already revised out of translated-English register).
const KABUPATEN_SENTENCE: Record<string, string> = {
  GUNUNGKIDUL: 'Hampir tiga dari sepuluh kalurahan di Gunungkidul memerlukan penanganan segera pada kedua kanal sekaligus. Konsentrasi ini merupakan yang tertinggi di DIY.',
  'KULON PROGO': 'Kulon Progo memiliki proporsi penguatan jangka panjang tertinggi di DIY, yaitu 49 dari 88 kalurahan. Penanganan di wilayah ini lebih mengarah pada penguatan basis ekonomi daripada perluasan titik layanan.',
  BANTUL: 'Sebagian besar kalurahan di Bantul cukup dipantau. Hanya satu kalurahan yang memerlukan penanganan segera.',
  SLEMAN: 'Profil Sleman menyerupai Bantul, dengan porsi penguatan jangka panjang yang sedikit lebih besar.',
  YOGYAKARTA: 'Kota Yogyakarta tidak memiliki kelurahan pada kategori penguatan jangka panjang. Kekurangan ketersediaan yang muncul di wilayah ini bersifat diagnostik, bukan struktural.',
};

export function Section3() {
  const villages = useAsync(loadVillagesJoined, []);
  const [selected, setSelected] = useState<string>('ALL');

  const byKabupaten = useMemo(() => {
    const map = new Map<string, { A: number; B: number; C: number; D: number; total: number }>();
    for (const kab of KABUPATEN_ORDER) map.set(kab, { A: 0, B: 0, C: 0, D: 0, total: 0 });
    for (const v of villages.data ?? []) {
      const entry = map.get(v.kabupaten);
      if (!entry) continue;
      entry[v.action.band]++;
      entry.total++;
    }
    return map;
  }, [villages.data]);

  if (villages.loading) return <AppSection id="wilayah-saya" number="3" title="Gambaran per kabupaten dan kota"><Skeleton /></AppSection>;
  if (!villages.data) return <AppSection id="wilayah-saya" number="3" title="Gambaran per kabupaten dan kota"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;

  const diyTotal = villages.data.length;
  const diyBand = BAND_ORDER.reduce((acc, b) => {
    acc[b] = villages.data!.filter((v) => v.action.band === b).length;
    return acc;
  }, {} as Record<Band, number>);

  return (
    <AppSection id="wilayah-saya" number="3" title="Gambaran per kabupaten dan kota">
      <p className="panel-purpose">Bukan setiap pembaca menangani seluruh DIY. Bagian ini menyempitkan provinsi ke cakupan masing-masing.</p>

      <div className="segmented" role="group" aria-label="Pilih kabupaten atau kota" style={{ flexWrap: 'wrap' }}>
        <button className={selected === 'ALL' ? 'active' : ''} onClick={() => setSelected('ALL')}>Seluruh DIY</button>
        {KABUPATEN_ORDER.map((kab) => (
          <button key={kab} className={selected === kab ? 'active' : ''} onClick={() => setSelected(kab)}>
            {kabupatenLabel(kab)}
          </button>
        ))}
      </div>

      {selected !== 'ALL' && (
        <p className="copy-block" style={{ marginTop: 'var(--space-4)' }}>{KABUPATEN_SENTENCE[selected]}</p>
      )}

      <div className="table-wrap" style={{ marginTop: 'var(--space-4)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Kabupaten/Kota</th>
              <th>Perlu penanganan segera</th>
              <th>Perlu diagnosis lebih dahulu</th>
              <th>Perlu penguatan jangka panjang</th>
              <th>Cukup dipantau</th>
            </tr>
          </thead>
          <tbody>
            {(selected === 'ALL' ? KABUPATEN_ORDER : [selected]).map((kab) => {
              const row = byKabupaten.get(kab)!;
              return (
                <tr key={kab}>
                  <td className="place-name">{kabupatenLabel(kab)}</td>
                  {BAND_ORDER.map((b) => (
                    <td key={b} className="num">
                      {fmtCount(row[b])} ({fmtIndex((row[b] / row.total) * 100, 1)}%)
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <td className="place-name"><em>Seluruh DIY</em></td>
              {BAND_ORDER.map((b) => (
                <td key={b} className="num data-face">
                  {fmtCount(diyBand[b])} ({fmtIndex((diyBand[b] / diyTotal) * 100, 1)}%)
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </AppSection>
  );
}
