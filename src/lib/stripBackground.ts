// StripPlot draws a "where does this village sit in the DIY distribution"
// strip. The 438 background dots are identical across every row that shares
// the same underlying column (e.g. every row's TRI strip) — only the
// highlighted value and median differ per row. Rendering them as live SVG
// <circle> elements per row means an unfiltered 438-row table creates
// 438 rows x 2 columns x 438 dots ~= 384,000 DOM nodes. Instead, render the
// dots once per (values, width, height) into a rasterized data: URI and
// reuse it as a CSS background-image — decoded once, blitted everywhere.
interface Entry { uri: string; lo: number; hi: number; width: number }
const cache = new WeakMap<number[], Map<string, Entry>>();

function getEntry(allValues: number[], width: number, height: number): Entry {
  const key = `${width}x${height}`;
  let forValues = cache.get(allValues);
  if (!forValues) { forValues = new Map(); cache.set(allValues, forValues); }
  const hit = forValues.get(key);
  if (hit) return hit;

  const lo = Math.min(...allValues), hi = Math.max(...allValues);
  const x = (v: number) => ((v - lo) / (hi - lo || 1)) * (width - 8) + 4;
  const dots = allValues
    .map((v) => `<circle cx="${x(v).toFixed(2)}" cy="${height / 2}" r="1.1" fill="#8b968f" fill-opacity="0.5"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`
    + `<line x1="4" x2="${width - 4}" y1="${height / 2}" y2="${height / 2}" stroke="#8b968f" stroke-width="1"/>`
    + dots + `</svg>`;
  const entry: Entry = { uri: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, lo, hi, width };
  forValues.set(key, entry);
  return entry;
}

export function getStripBackground(allValues: number[], width: number, height: number): string {
  return getEntry(allValues, width, height).uri;
}

// Reuses the same lo/hi the background image was built from, so the
// foreground marker lines up with its dots without a second full scan.
export function stripScale(allValues: number[], width: number, height: number): (v: number) => number {
  const { lo, hi } = getEntry(allValues, width, height);
  return (v: number) => ((v - lo) / (hi - lo || 1)) * (width - 8) + 4;
}
