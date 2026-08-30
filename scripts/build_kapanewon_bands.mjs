// Authors public/data/kapanewon_bands.json: band counts per kecamatan/
// kapanewon, precomputed rather than aggregated in the browser (spec v4
// section 10 / data inventory note). Band is derived by joining
// villages_policy.csv -> lookup_categories.csv (category name -> key) ->
// lookup_actions_policy.csv (key -> band), all delivered files.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, '..', 'database');
const OUT = path.join(__dirname, '..', 'public', 'data', 'kapanewon_bands.json');

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

const master = parseCsv(readFileSync(path.join(DB, 'villages_master.csv'), 'utf8'));
const policy = parseCsv(readFileSync(path.join(DB, 'villages_policy.csv'), 'utf8'));
const categories = parseCsv(readFileSync(path.join(DB, 'lookup_categories.csv'), 'utf8'));
const actions = parseCsv(readFileSync(path.join(DB, 'lookup_actions_policy.csv'), 'utf8'));

const catKeyByIdn = new Map(categories.map((c) => [c.dashboard_category_idn, c.category_key]));
const bandByCatKey = new Map(actions.map((a) => [a.category_key, a.band]));
const policyById = new Map(policy.map((p) => [p.village_id, p]));

const byKec = new Map();
for (const m of master) {
  const p = policyById.get(m.village_id);
  const band = p ? bandByCatKey.get(catKeyByIdn.get(p.dashboard_category_idn)) : undefined;
  if (!band) continue;
  const key = `${m.kabupaten}|${m.kecamatan}`;
  const entry = byKec.get(key) ?? { kabupaten: m.kabupaten, kecamatan: m.kecamatan, A: 0, B: 0, C: 0, D: 0, total: 0 };
  entry[band]++;
  entry.total++;
  byKec.set(key, entry);
}

const rows = [...byKec.values()].sort((a, b) => b.A - a.A || a.kabupaten.localeCompare(b.kabupaten));
writeFileSync(OUT, JSON.stringify(rows));
console.log(`Wrote ${OUT}: ${rows.length} kecamatan/kapanewon`);
console.log('Top band A:', rows.filter((r) => r.A > 0).slice(0, 8));
