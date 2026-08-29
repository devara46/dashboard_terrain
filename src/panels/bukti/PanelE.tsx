import { useMemo } from 'react';
import { PanelSection } from '../../components/layout/PanelSection';
import { SankeyFlow } from '../../components/charts/SankeyFlow';
import { useAsync } from '../../lib/useAsync';
import { loadVillagesTypology, loadLookupLabels, loadSummaryHeadline } from '../../lib/dataLoader';
import { useVizConfig } from '../../context/VizConfigContext';
import { Skeleton } from '../../components/common/Value';
import { fmtCount, fmtIndex } from '../../lib/format';
import '../panels.css';

export function PanelE() {
  const typology = useAsync(loadVillagesTypology, []);
  const labels = useAsync(loadLookupLabels, []);
  const summary = useAsync(loadSummaryHeadline, []);
  const config = useVizConfig();

  const idnMap = useMemo(() => {
    const m = new Map<string, string>();
    (labels.data ?? []).filter((l) => l.field === 'quadrant').forEach((l) => m.set(l.value_en, l.value_idn));
    return m;
  }, [labels.data]);

  const loading = typology.loading || labels.loading || summary.loading || !config;
  if (loading) return <PanelSection id="divergensi" letter="E" title="Divergensi antar kanal"><Skeleton /></PanelSection>;
  if (!typology.data || !summary.data) return <PanelSection id="divergensi" letter="E" title="Divergensi antar kanal"><p className="notice-bar">Estimasi belum tersedia pada berkas data yang dimuat.</p></PanelSection>;

  const quadColors = config.ramps.quadrant as Record<string, string>;
  const pairs = typology.data.map((t) => ({ ffas: t.Q_FFAS, dis: t.Q_DIS }));

  return (
    <PanelSection id="divergensi" letter="E" title="Divergensi antar kanal">
      <p className="panel-purpose">Kedua kanal tidak bergerak bersama, yang berarti satu indeks gabungan untuk inklusi keuangan tidak memadai.</p>

      <div className="hero-bignum" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
        <span className="hero-bignum-value" style={{ fontSize: 'var(--step-3)' }}>
          {fmtCount(summary.data.n_channel_divergent)} dari 438 ({fmtIndex(summary.data.pct_channel_divergent, 1)}%)
        </span>
        <span className="hero-bignum-label">desa menempati kuadran berbeda pada kedua kanal</span>
      </div>

      <SankeyFlow
        pairs={pairs}
        idnLabel={(q) => idnMap.get(q) ?? q}
        colorFor={(q) => quadColors[q] ?? '#999'}
      />

      <p className="caption">
        Lebih dari sepertiga desa menempati kuadran yang berbeda pada kedua kanal. Kebijakan yang menargetkan
        inklusi keuangan melalui satu indeks gabungan akan salah sasaran pada kelompok desa ini.
      </p>
    </PanelSection>
  );
}
