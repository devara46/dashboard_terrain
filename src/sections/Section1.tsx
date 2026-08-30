import { useMemo } from 'react';
import { AppSection } from '../components/layout/AppSection';
import { useAsync } from '../lib/useAsync';
import { loadLookupActionsPolicy, loadSummaryHeadline, loadPaperResults } from '../lib/dataLoader';
import { Skeleton } from '../components/common/Value';
import { fmtCount, fmtIndex } from '../lib/format';
import type { LookupActionPolicy, Band, PaperResults } from '../lib/types';
import './sections.css';

const BAND_ORDER: Band[] = ['A', 'B', 'C', 'D'];

type CompositionKey = keyof PaperResults['composition_beat'];
const COMPOSITION_SEGMENTS: { key: CompositionKey; label: string; color: string }[] = [
  { key: 'residual_both', label: 'Residual pada kedua kanal', color: 'var(--kontur)' },
  { key: 'residual_ffas_no_dominance_dis', label: 'Residual FFAS, tanpa dominasi DIS', color: '#a9b3ac' },
  { key: 'residual_ffas_terrain_dis', label: 'Residual FFAS, medan DIS', color: 'var(--bukit)' },
  { key: 'no_dominance_ffas_terrain_dis', label: 'Tanpa dominasi FFAS, medan DIS', color: '#c98868' },
  { key: 'no_dominance_ffas_residual_dis', label: 'Tanpa dominasi FFAS, residual DIS', color: '#cfd6cf' },
];

export function Section1() {
  const actions = useAsync(loadLookupActionsPolicy, []);
  const summary = useAsync(loadSummaryHeadline, []);
  const paper = useAsync(loadPaperResults, []);

  const byBand = useMemo(() => {
    const map = new Map<Band, LookupActionPolicy[]>();
    for (const a of actions.data ?? []) {
      const list = map.get(a.band) ?? [];
      list.push(a);
      map.set(a.band, list);
    }
    return map;
  }, [actions.data]);

  const loading = actions.loading || summary.loading || paper.loading;
  if (loading) return <AppSection id="empat-keputusan" number="1" title="Empat jenis keputusan untuk 438 desa"><Skeleton /></AppSection>;
  if (!actions.data || !summary.data || !paper.data) {
    return <AppSection id="empat-keputusan" number="1" title="Empat jenis keputusan untuk 438 desa"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></AppSection>;
  }

  const total = summary.data.n_villages;
  const comp = paper.data.composition_beat;

  return (
    <AppSection id="empat-keputusan" number="1" title="Empat jenis keputusan untuk 438 desa">
      <p className="panel-purpose">Setiap band berikut menjelaskan apa yang perlu dilakukan, dalam bahasa pembaca, sebelum peta ditampilkan.</p>

      <div className="decision-blocks">
        {BAND_ORDER.map((band) => {
          const cats = byBand.get(band) ?? [];
          const n = cats.reduce((a, c) => a + c.n, 0);
          const share = (n / total) * 100;
          return (
            <div key={band} className="decision-block" style={{ borderLeftColor: cats[0]?.color }}>
              <div className="decision-block-head">
                <span className="decision-block-verb">{cats.map((c) => c.verb_idn).join(' · ')}</span>
                <span className="decision-block-count data-face">{fmtCount(n)} desa · {fmtIndex(share, 1)}%</span>
              </div>
              {cats.map((c) => (
                <div key={c.category_key} className="decision-block-body">
                  <p className="copy-block">{c.plain_idn}</p>
                  <p className="copy-block decision-block-instrument"><strong>Instrumen:</strong> {c.instrument_idn}</p>
                  <p className="decision-block-actors">
                    <strong>Pemrakarsa:</strong> {c.lead_actor}. <strong>Pendukung:</strong> {c.support_actors.join('; ')}.
                  </p>
                  <div className="notice-bar decision-block-caution">{c.caution_idn}</div>
                </div>
              ))}

              {band === 'A' && (
                <div className="composition-beat">
                  <span className="chart-row-label">Komposisi Prioritas Pasokan Ganda ({fmtCount(comp.total)} desa)</span>
                  <div className="class-stacked-bar">
                    {COMPOSITION_SEGMENTS.map((seg) => {
                      const value = comp[seg.key];
                      return <div key={seg.key} className="class-stacked-segment" style={{ width: `${(value / comp.total) * 100}%`, background: seg.color }} title={`${seg.label}: ${value}`} />;
                    })}
                  </div>
                  <div className="class-stacked-legend">
                    {COMPOSITION_SEGMENTS.map((seg) => (
                      <span key={seg.key} className="legend-row">
                        <span className="map-legend-swatch" style={{ background: seg.color }} />
                        {seg.label}: {fmtCount(comp[seg.key])}
                      </span>
                    ))}
                  </div>
                  <p className="caption">
                    Prioritas Pasokan Ganda hanya menyatakan bahwa kedua kanal kekurangan pasokan pada kondisi
                    permintaan tinggi. Ia bukan rekomendasi untuk membangun jalan, kantor cabang, dan menara secara
                    bersamaan.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppSection>
  );
}
