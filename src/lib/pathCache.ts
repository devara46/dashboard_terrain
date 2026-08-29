import { geoMercator, geoPath } from 'd3-geo';
import type { VillageGeomCollection } from './types';

// Projecting 438 villages (~46k arc points) to SVG path strings costs
// roughly 200ms per unique (width,height) box. Six-plus Choropleth
// instances computing this synchronously inside useMemo during the same
// render pass is what froze the tab. Fix: cache the result per (geom,
// width, height) so repeats are free, and compute the first time inside a
// setTimeout so it never blocks the render/paint that triggered it.
// (Deliberately setTimeout, not requestAnimationFrame: rAF can be fully
// paused in a backgrounded/non-visible tab, which would leave the map
// stuck on its loading placeholder indefinitely if the user switches away
// mid-load. setTimeout still fires — clamped, but it fires.)
type PathMap = Map<string, string>;

const cache = new WeakMap<VillageGeomCollection, Map<string, PathMap>>();
const pending = new WeakMap<VillageGeomCollection, Map<string, Promise<PathMap>>>();

function computeSync(geom: VillageGeomCollection, width: number, height: number): PathMap {
  const projection = geoMercator().fitSize([width, height], geom as unknown as GeoJSON.GeoJSON);
  const gen = geoPath(projection);
  const map: PathMap = new Map();
  for (const f of geom.features) {
    map.set(f.properties.village_id, gen(f as unknown as GeoJSON.Feature) ?? '');
  }
  return map;
}

export function getCachedPaths(geom: VillageGeomCollection, width: number, height: number): PathMap | null {
  return cache.get(geom)?.get(`${width}x${height}`) ?? null;
}

// Serialize the actual heavy computations one at a time (each yielding via
// setTimeout before the next starts) so several Choropleth instances
// mounting in the same render batch don't all crunch back-to-back — that
// would just recreate the freeze as one big synchronous chain.
let queue: Promise<void> = Promise.resolve();
function runQueued<T>(task: () => T): Promise<T> {
  const result = queue.then(() => new Promise<T>((resolve) => {
    setTimeout(() => resolve(task()), 0);
  }));
  queue = result.then(() => undefined, () => undefined);
  return result;
}

export function computePathsAsync(geom: VillageGeomCollection, width: number, height: number): Promise<PathMap> {
  const key = `${width}x${height}`;
  const already = cache.get(geom)?.get(key);
  if (already) return Promise.resolve(already);

  let pendingForGeom = pending.get(geom);
  if (!pendingForGeom) { pendingForGeom = new Map(); pending.set(geom, pendingForGeom); }
  const inFlight = pendingForGeom.get(key);
  if (inFlight) return inFlight;

  const promise = runQueued(() => computeSync(geom, width, height)).then((result) => {
    let geomCache = cache.get(geom);
    if (!geomCache) { geomCache = new Map(); cache.set(geom, geomCache); }
    geomCache.set(key, result);
    pendingForGeom!.delete(key);
    return result;
  });
  pendingForGeom.set(key, promise);
  return promise;
}
