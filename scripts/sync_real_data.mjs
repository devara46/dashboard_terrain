// Copies the delivered split files (database/) into public/data/ verbatim.
// Geometry is handled separately by build_geometry.mjs since it needs
// simplification; everything else here is already in its final shape.
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'database');
const OUT = path.join(__dirname, '..', 'public', 'data');

const FILES = [
  'villages_master.csv',
  'villages_geography.csv',
  'villages_outcomes.csv',
  'villages_demand.csv',
  'villages_nonfarm_components.csv',
  'villages_typology.csv',
  'villages_decomposition.csv',
  'villages_patterns.csv',
  'villages_policy.csv',
  'lookup_categories.csv',
  'lookup_labels.csv',
  'agg_kabupaten.csv',
  'summary_headline.json',
];

for (const f of FILES) {
  const src = path.join(SRC, f);
  if (!existsSync(src)) {
    console.warn(`Missing source file, skipped: ${f}`);
    continue;
  }
  copyFileSync(src, path.join(OUT, f));
  console.log(`Synced ${f}`);
}
