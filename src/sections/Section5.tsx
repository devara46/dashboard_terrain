import { useState } from 'react';
import { AppSection } from '../components/layout/AppSection';
import './sections.css';

interface FunctionNode { key: string; label: string; actors: string[]; }

// Actors grouped by coordination function, derived from lead_actor / support_actors
// across all five categories in lookup_actions_policy.csv (paper_results.actors,
// the structure named in spesifikasi_dashboard_v4.md section 7, was not supplied
// for this build — this grouping is a reasonable first pass from the delivered
// actor lists, pending confirmation per open item 4).
const FUNCTIONS: FunctionNode[] = [
  { key: 'target', label: 'TARGET', actors: ['Bappeda DIY'] },
  { key: 'connect', label: 'CONNECT', actors: ['Diskominfo DIY', 'operator telekomunikasi', 'BAKTI Komdigi', 'DPUPESDM DIY'] },
  { key: 'finance', label: 'FINANCE', actors: ['KPw Bank Indonesia DIY', 'OJK DIY', 'lembaga jasa keuangan'] },
  { key: 'strengthen', label: 'STRENGTHEN', actors: ['Dinas Koperasi dan UKM DIY'] },
  { key: 'implement', label: 'IMPLEMENT & MONITOR', actors: ['pemerintah kabupaten dan kota', 'pemerintah kalurahan'] },
];

const RADIUS = 150;
const CENTER = 190;

export function Section5() {
  const [hoveredFn, setHoveredFn] = useState<string | null>(null);

  return (
    <AppSection id="pembagian-peran" number="5" title="Pembagian peran antar-lembaga">
      <p className="panel-purpose">Menjawab siapa pada tingkat fungsi, bukan hanya nama lembaga.</p>

      <div className="actor-cycle-wrap">
        <svg viewBox="0 0 380 380" width="100%" style={{ maxWidth: 420 }} role="img" aria-label="Siklus fungsi koordinasi">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--kontur)" strokeDasharray="3 4" />
          <text x={CENTER} y={CENTER - 4} textAnchor="middle" className="chart-axis-label" fontSize="0.7rem">Reklasifikasi</text>
          <text x={CENTER} y={CENTER + 10} textAnchor="middle" className="chart-axis-label" fontSize="0.6rem">pada pembaruan data</text>
          {FUNCTIONS.map((fn, i) => {
            const angle = (Math.PI * 2 * i) / FUNCTIONS.length - Math.PI / 2;
            const x = CENTER + RADIUS * Math.cos(angle);
            const y = CENTER + RADIUS * Math.sin(angle);
            const active = hoveredFn === fn.key;
            return (
              <g
                key={fn.key}
                onMouseEnter={() => setHoveredFn(fn.key)}
                onMouseLeave={() => setHoveredFn(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={x} cy={y} r={40} fill={active ? 'var(--telaga)' : 'var(--kapur-raised)'} stroke="var(--andesit)" strokeWidth={active ? 2 : 1} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="chart-row-label" fontSize="0.62rem" fontWeight={700} fill={active ? 'var(--kapur)' : 'var(--andesit)'}>
                  {fn.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="actor-cycle-detail">
          {FUNCTIONS.map((fn) => (
            <div
              key={fn.key}
              className={'actor-cycle-row' + (hoveredFn === fn.key ? ' active' : '')}
              onMouseEnter={() => setHoveredFn(fn.key)}
              onMouseLeave={() => setHoveredFn(null)}
            >
              <span className="chart-row-label">{fn.label}</span>
              <span className="caption" style={{ margin: 0 }}>{fn.actors.join('; ')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="notice-bar" style={{ marginTop: 'var(--space-4)' }}>
        Pemetaan lembaga ini merupakan usulan fungsi koordinasi berdasarkan hasil penelitian, bukan penetapan
        kewenangan hukum. Mandat formal tetap perlu diverifikasi terhadap peraturan yang berlaku.
      </div>
      <p className="copy-block" style={{ marginTop: 'var(--space-3)' }}>
        Tipologi ini merupakan potret analitis, bukan label permanen. Siklus identifikasi, diagnosis, intervensi,
        pemantauan, dan reklasifikasi dimaksudkan berulang seiring pembaruan data.
      </p>
    </AppSection>
  );
}
