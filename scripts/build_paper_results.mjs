// Authors public/data/paper_results.json: manuscript-level statistics that
// live in the paper (draft v12), not in any village-level split file. Values
// are taken verbatim from spesifikasi_dashboard_v4.md sections 2 and 6-12,
// which state them to 3-4 decimal places as the build's source of truth.
// Where a number IS derivable from the delivered village-level CSVs (the
// band-A composition beat), it is computed here instead of hardcoded, so it
// stays correct if the underlying data is revised.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, '..', 'database');
const OUT = path.join(__dirname, '..', 'public', 'data', 'paper_results.json');

function parseCsv(txt) {
  const clean = txt.charCodeAt(0) === 0xfeff ? txt.slice(1) : txt;
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQ) { if (ch === '"') { if (clean[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\r') { /* skip */ }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1 || r[0] !== '').map((r) => {
    const o = {}; header.forEach((h, i) => { o[h] = r[i] ?? ''; }); return o;
  });
}

const policy = parseCsv(readFileSync(path.join(DB, 'villages_policy.csv'), 'utf8'));
const decomposition = parseCsv(readFileSync(path.join(DB, 'villages_decomposition.csv'), 'utf8'));

const decByVillage = {};
for (const d of decomposition) {
  decByVillage[d.village_id] = decByVillage[d.village_id] ?? {};
  decByVillage[d.village_id][d.channel] = d.constraint_class;
}
const dualIds = policy.filter((p) => p.dashboard_category_idn === 'Prioritas Pasokan Ganda').map((p) => p.village_id);
const compositionCounts = {};
for (const id of dualIds) {
  const key = `${decByVillage[id].FFAS}|${decByVillage[id].DIS}`;
  compositionCounts[key] = (compositionCounts[key] ?? 0) + 1;
}
const composition_beat = {
  total: dualIds.length,
  residual_both: compositionCounts['Residual-constrained|Residual-constrained'] ?? 0,
  residual_ffas_no_dominance_dis: compositionCounts['Residual-constrained|No significant dominance'] ?? 0,
  residual_ffas_terrain_dis: compositionCounts['Residual-constrained|Terrain-constrained'] ?? 0,
  no_dominance_ffas_terrain_dis: compositionCounts['No significant dominance|Terrain-constrained'] ?? 0,
  no_dominance_ffas_residual_dis: compositionCounts['No significant dominance|Residual-constrained'] ?? 0,
};

const results = {
  // Section 6 — the leapfrogging prediction, stated as falsifiable.
  leapfrogging_prediction: {
    label_predicted: 'Sensitivitas kanal digital lebih rendah',
    label_observed: 'Sensitivitas kanal digital lebih tinggi',
  },

  // Section 7 — terrain vs accessibility, correlational evidence before the causal estimate.
  terrain_accessibility: {
    pearson_all_diy: -0.441,
    spearman_all_diy: -0.577,
    partial_within_kabupaten: -0.213,
    tri_on_pai_coef: -0.136,
    tri_on_pai_p: 0.003,
    weak_instrument_f: 9.68,
  },

  // Section 8 — the manuscript's headline: standardised 2SLS effect of
  // accessibility on each channel, and the equality test between them.
  two_channel_estimate: {
    ffas: { coef: 0.622, ci_lo: 0.167, ci_hi: 1.363 },
    dis: { coef: 1.299, ci_lo: 0.822, ci_hi: 2.818 },
    difference: 0.677,
    anderson_rubin_p: 0.0137,
    confidence_set: { lo: 0.149, hi: 1.961 },
  },

  // Section 9 — spatial autocorrelation (rho) per channel; the null result.
  spatial_dependency: {
    rho_ffas: 0.4673,
    rho_dis: 0.3920,
    difference: -0.0753,
    ci90: { lo: -0.230, hi: 0.148 },
    weight_matrix: 'queen',
  },

  // Section 10 — nested sets (also mirrored in summary_headline.json's
  // n_ffas_terrain / n_dis_terrain / n_ffas_only_terrain — kept here too so
  // this file is a complete, self-contained record of every evidence-half number).
  terrain_dominant_counts: { dis: 64, ffas: 7, ffas_only: 0 },

  // Section 11 — non-farm economic base and livelihood shift as mediators,
  // proportion of the accessibility effect each channel accounts for.
  mechanism_ffas: {
    nonfarm_base_pct: 79.7,
    nonfarm_base_pct_dis: 22.0,
    livelihood_shift_pct: 42.1,
    livelihood_shift_pct_dis: 10.6,
  },

  // Section 1 — band A is not one problem; composition by constraint pattern.
  // Computed from villages_policy.csv x villages_decomposition.csv (see above),
  // matching the values stated in spesifikasi_dashboard_v4.md section 3 exactly.
  composition_beat,

  // Section 12 — limitations stated in the manuscript, compiled from the
  // caveats that already appear (verbatim) elsewhere in the spec and lookup
  // data, rather than restated ad hoc per section.
  limitations: [
    {
      title: 'Ketergantungan pada Stage 2',
      body: 'Komponen medan dalam dekomposisi kesenjangan pasokan dihitung menggunakan koefisien Stage 2. Diagnosis ini memetakan sebaran spasial dari mekanisme yang telah diestimasi, bukan konfirmasi yang berdiri sendiri.',
    },
    {
      title: 'Mediasi tidak diacak',
      body: 'Mediator tidak diacak dan desain penelitian tidak memenuhi asumsi mediasi kausal penuh. Hasil pada mekanisme kanal keuangan merupakan diagnosis yang konsisten dengan mekanisme, bukan estimasi mediasi kausal.',
    },
    {
      title: 'Kategori residual tidak spesifik',
      body: 'Kategori residual hanya menyatakan bahwa penyebab kesenjangan bukan kondisi medan. Ia tidak menunjukkan penyebab yang spesifik — cakupan penyedia, desain layanan, keterjangkauan, dan kapasitas kelembagaan semuanya tetap mungkin.',
    },
    {
      title: 'Tidak ada estimasi biaya',
      body: 'Keempat band keputusan menyatakan urutan penanganan, bukan besaran anggaran. Penelitian ini tidak menghitung biaya intervensi.',
    },
    {
      title: 'Potret pada satu titik waktu',
      body: 'Tipologi ini merupakan potret analitis pada satu titik waktu, bukan label permanen. Desa dapat berpindah band pada pembaruan data berikutnya.',
    },
    {
      title: 'Pemetaan aktor bukan mandat hukum',
      body: 'Pemetaan lembaga pada pembagian peran merupakan usulan fungsi koordinasi berdasarkan hasil penelitian, bukan penetapan kewenangan hukum. Mandat formal tetap perlu diverifikasi terhadap peraturan yang berlaku.',
    },
  ],

  // Robustness checks the manuscript reports qualitatively; exact per-variant
  // values were not supplied for this build (open item 6 in the v4 spec) —
  // stated here without fabricated numbers, pending confirmation.
  robustness_checks: [
    { label: 'Definisi ketetanggaan alternatif', detail: 'Diperiksa terhadap k = 5, 10, dan 15 tetangga terdekat, serta ketetanggaan queen. Nilai selisih rho per varian belum dikonfirmasi untuk build ini.' },
    { label: 'Skala standar dan skala asli', detail: 'Estimasi Stage 1 dibandingkan pada skala baku (unit simpangan) dan skala asli, untuk menunjukkan mengapa standardisasi diperlukan sebelum FFAS dan DIS dapat dibandingkan.' },
    { label: 'Model dalam kabupaten dan model gabungan DIY', detail: 'Hubungan keterjalan medan dan aksesibilitas fisik diperiksa baik pada gabungan seluruh DIY maupun dalam kabupaten, untuk memastikan hubungan tidak semata didorong oleh perbedaan antar-kabupaten.' },
  ],
};

writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`Wrote ${OUT}`);
console.log('composition_beat', composition_beat);
