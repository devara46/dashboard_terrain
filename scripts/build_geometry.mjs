// Converts database/batas_desa_rbi.geojson into a simplified, quantized TopoJSON
// under public/data/villages_geom.json, stripped to village_id only (section 13
// of spesifikasi_dashboard_v2.md). Shared borders are preserved via topology,
// so simplification cannot open gaps between neighbouring villages.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { topology } from 'topojson-server';
import { presimplify, simplify } from 'topojson-simplify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'database', 'batas_desa_rbi.geojson');
const OUT = path.join(__dirname, '..', 'public', 'data', 'villages_geom.json');
const TARGET_BYTES = 1.9 * 1000 * 1000; // stay safely under the 2 MB budget (decimal MB)

const raw = JSON.parse(readFileSync(SRC, 'utf8'));
const stripped = {
  type: 'FeatureCollection',
  features: raw.features.map((f) => ({
    type: 'Feature',
    properties: { village_id: String(f.properties.village_id) },
    geometry: f.geometry,
  })),
};
console.log(`Source features: ${stripped.features.length}`);

let topo = topology({ villages: stripped }, 1e5);
topo = presimplify(topo);

function sizeAt(minWeight) {
  const simplified = simplify(topo, minWeight);
  const json = JSON.stringify(simplified);
  return { bytes: Buffer.byteLength(json), json, simplified };
}

// topojson-simplify's own quantile() helper is unreliable on this weight
// distribution (many arc-junction points carry a protected/near-zero weight
// that skews its percentile estimate) — bisect directly on output byte size
// against the minWeight threshold instead, which is monotonic.
let lo = 1e-10, hi = 1e-6, best = null;
for (let i = 0; i < 24; i++) {
  const mid = Math.sqrt(lo * hi); // geometric-mean step, weight spans orders of magnitude
  const { bytes, json, simplified } = sizeAt(mid);
  console.log(`minWeight=${mid.toExponential(3)} bytes=${bytes}`);
  if (bytes > TARGET_BYTES) {
    lo = mid;
  } else {
    hi = mid;
    best = { json, simplified, bytes };
  }
}

const nFeaturesOut = best.simplified.objects.villages.geometries.length;
writeFileSync(OUT, best.json);
console.log(`Wrote ${OUT}: ${(best.bytes / 1e6).toFixed(2)} MB, ${nFeaturesOut} villages`);
