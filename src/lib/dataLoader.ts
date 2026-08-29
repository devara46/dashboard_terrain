import { parseCsv, num, bool } from './csv';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type {
  VillageMaster, VillageGeography, VillageOutcomes, VillageDemand, NonfarmComponentRow,
  VillageTypology, VillageDecomposition, VillagePattern, VillagePolicy,
  LookupCategory, LookupLabel, AggKabupaten, SummaryHeadline, VizConfig,
  VillageGeomCollection, Channel,
} from './types';

const DATA_BASE = import.meta.env.BASE_URL + 'data/';
const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, loader());
  return cache.get(key) as Promise<T>;
}
async function fetchText(name: string): Promise<string> {
  const res = await fetch(DATA_BASE + name);
  if (!res.ok) throw new Error(`Gagal memuat ${name}: ${res.status}`);
  return res.text();
}
async function fetchJson<T>(name: string): Promise<T> {
  const res = await fetch(DATA_BASE + name);
  if (!res.ok) throw new Error(`Gagal memuat ${name}: ${res.status}`);
  return res.json();
}
async function loadCsv(name: string) {
  return parseCsv(await fetchText(name));
}

export function loadVillagesMaster(): Promise<VillageMaster[]> {
  return cached('villages_master', async () => {
    const rows = await loadCsv('villages_master.csv');
    return rows.map((r) => ({
      village_id: r.village_id, desa: r.desa, kecamatan: r.kecamatan, kabupaten: r.kabupaten,
      urban_rural: r.urban_rural, urban_rural_code: r.urban_rural_code,
    }));
  });
}

export function loadVillagesGeography(): Promise<VillageGeography[]> {
  return cached('villages_geography', async () => {
    const rows = await loadCsv('villages_geography.csv');
    return rows.map((r) => ({
      village_id: r.village_id, TRI: num(r.TRI), TRI_c: num(r.TRI_c),
      TRI_percentile_DIY: num(r.TRI_percentile_DIY), PAI: num(r.PAI),
      PAI_percentile_DIY: num(r.PAI_percentile_DIY),
    }));
  });
}

export function loadVillagesOutcomes(): Promise<VillageOutcomes[]> {
  return cached('villages_outcomes', async () => {
    const rows = await loadCsv('villages_outcomes.csv');
    return rows.map((r) => ({
      village_id: r.village_id, FFAS_count: num(r.FFAS_count), FFAS_std: num(r.FFAS_std),
      DIS: num(r.DIS), DIS_std: num(r.DIS_std), DI_final: num(r.DI_final), DI_std: num(r.DI_std),
      MI_FFAS: num(r.MI_FFAS), MI_DIS: num(r.MI_DIS),
    }));
  });
}

export function loadVillagesDemand(): Promise<VillageDemand[]> {
  return cached('villages_demand', async () => {
    const rows = await loadCsv('villages_demand.csv');
    return rows.map((r) => ({
      village_id: r.village_id, demand_level_idn: r.demand_level_idn, DemandFamily: r.DemandFamily,
      NonFarmEnt: num(r.NonFarmEnt), LivelihoodShift: num(r.LivelihoodShift), R906A: num(r.R906A),
    }));
  });
}

export function loadNonfarmComponents(): Promise<NonfarmComponentRow[]> {
  return cached('villages_nonfarm_components', async () => {
    const rows = await loadCsv('villages_nonfarm_components.csv');
    return rows.map((r) => ({ village_id: r.village_id, component: r.component, z_value: num(r.z_value) }));
  });
}

export function loadVillagesTypology(): Promise<VillageTypology[]> {
  return cached('villages_typology', async () => {
    const rows = await loadCsv('villages_typology.csv');
    return rows.map((r) => ({
      village_id: r.village_id,
      Q_FFAS: r.Q_FFAS as VillageTypology['Q_FFAS'], q_ffas_idn: r.q_ffas_idn,
      Q_DIS: r.Q_DIS as VillageTypology['Q_DIS'], q_dis_idn: r.q_dis_idn,
      ChannelPattern: r.ChannelPattern, channel_divergent: bool(r.channel_divergent),
    }));
  });
}

export function loadVillagesDecomposition(): Promise<VillageDecomposition[]> {
  return cached('villages_decomposition', async () => {
    const rows = await loadCsv('villages_decomposition.csv');
    return rows.map((r) => ({
      village_id: r.village_id, channel: r.channel as Channel,
      gap: num(r.gap), gap_terrain: num(r.gap_terrain), gap_residual: num(r.gap_residual),
      dominance_margin: num(r.dominance_margin),
      ci_lo_terrain: num(r.ci_lo_terrain), ci_hi_terrain: num(r.ci_hi_terrain),
      ci_lo_residual: num(r.ci_lo_residual), ci_hi_residual: num(r.ci_hi_residual),
      ci_lo_dominance: num(r.ci_lo_dominance), ci_hi_dominance: num(r.ci_hi_dominance),
      pr_terrain_abs_dominates: num(r.pr_terrain_abs_dominates),
      pr_residual_abs_dominates: num(r.pr_residual_abs_dominates),
      pr_terrain_positive: num(r.pr_terrain_positive), pr_residual_positive: num(r.pr_residual_positive),
      constraint_class: r.constraint_class as VillageDecomposition['constraint_class'],
      constraint_class_short: r.constraint_class_short, constraint_reason: r.constraint_reason,
      constraint_class_idn: r.constraint_class_idn,
    }));
  });
}

export function loadVillagesPatterns(): Promise<VillagePattern[]> {
  return cached('villages_patterns', async () => {
    const rows = await loadCsv('villages_patterns.csv');
    return rows.map((r) => ({ village_id: r.village_id, TerrainPattern: r.TerrainPattern, ConstraintPattern: r.ConstraintPattern }));
  });
}

export function loadVillagesPolicy(): Promise<VillagePolicy[]> {
  return cached('villages_policy', async () => {
    const rows = await loadCsv('villages_policy.csv');
    return rows.map((r) => ({
      village_id: r.village_id, priority_order: num(r.priority_order),
      immediate_priority: bool(r.immediate_priority),
      priority_channel: r.priority_channel as VillagePolicy['priority_channel'],
      dashboard_category_idn: r.dashboard_category_idn, dashboard_policy_tier_idn: r.dashboard_policy_tier_idn,
      Stage5_Category: r.Stage5_Category, Stage5_PolicyTier: r.Stage5_PolicyTier,
    }));
  });
}

export function loadLookupCategories(): Promise<LookupCategory[]> {
  return cached('lookup_categories', async () => {
    const rows = await loadCsv('lookup_categories.csv');
    return rows.map((r) => ({
      category_key: r.category_key, Stage5_Category: r.Stage5_Category,
      dashboard_category_idn: r.dashboard_category_idn, Stage5_PolicyTier: r.Stage5_PolicyTier,
      dashboard_policy_tier_idn: r.dashboard_policy_tier_idn, Stage5_Action: r.Stage5_Action,
      Stage5_Action_IDN: r.Stage5_Action_IDN, category_color_hex: r.category_color_hex,
      priority_order: num(r.priority_order), n_villages: num(r.n_villages),
    }));
  });
}

export function loadLookupLabels(): Promise<LookupLabel[]> {
  return cached('lookup_labels', async () => {
    const rows = await loadCsv('lookup_labels.csv');
    return rows.map((r) => ({ field: r.field, value_en: r.value_en, value_idn: r.value_idn }));
  });
}

export function loadAggKabupaten(): Promise<AggKabupaten[]> {
  return cached('agg_kabupaten', async () => {
    const rows = await loadCsv('agg_kabupaten.csv');
    return rows.map((r) => ({
      kabupaten: r.kabupaten, n_villages: num(r.n_villages), mean_TRI: num(r.mean_TRI), mean_PAI: num(r.mean_PAI),
      mean_FFAS_count: num(r.mean_FFAS_count), mean_DIS: num(r.mean_DIS),
      n_ffas_terrain: num(r.n_ffas_terrain), n_dis_terrain: num(r.n_dis_terrain), n_both_terrain: num(r.n_both_terrain),
      n_immediate_priority: num(r.n_immediate_priority), n_channel_divergent: num(r.n_channel_divergent),
    }));
  });
}

export function loadSummaryHeadline(): Promise<SummaryHeadline> {
  return cached('summary_headline', () => fetchJson<SummaryHeadline>('summary_headline.json'));
}

export function loadVizConfig(): Promise<VizConfig> {
  return cached('viz_config', () => fetchJson<VizConfig>('viz_config.json'));
}

export function loadVillagesGeom(): Promise<VillageGeomCollection> {
  return cached('villages_geom', async () => {
    const topo = await fetchJson<Topology>('villages_geom.json');
    const obj = topo.objects.villages as GeometryCollection;
    return feature(topo, obj) as unknown as VillageGeomCollection;
  });
}

export interface VillageJoined extends VillageMaster, VillageGeography, VillageOutcomes, VillageDemand, VillageTypology, VillagePattern, VillagePolicy {}

export async function loadVillagesJoined(): Promise<VillageJoined[]> {
  return cached('villages_joined', async () => {
    const [master, geo, outcomes, demand, typology, patterns, policy] = await Promise.all([
      loadVillagesMaster(), loadVillagesGeography(), loadVillagesOutcomes(), loadVillagesDemand(),
      loadVillagesTypology(), loadVillagesPatterns(), loadVillagesPolicy(),
    ]);
    const byId = <T extends { village_id: string }>(arr: T[]) => new Map(arr.map((r) => [r.village_id, r]));
    const geoM = byId(geo), outM = byId(outcomes), demM = byId(demand), typM = byId(typology), patM = byId(patterns), polM = byId(policy);
    return master.map((m) => ({
      ...m,
      ...(geoM.get(m.village_id) as VillageGeography),
      ...(outM.get(m.village_id) as VillageOutcomes),
      ...(demM.get(m.village_id) as VillageDemand),
      ...(typM.get(m.village_id) as VillageTypology),
      ...(patM.get(m.village_id) as VillagePattern),
      ...(polM.get(m.village_id) as VillagePolicy),
    }));
  });
}

export interface DecompositionByChannel { FFAS?: VillageDecomposition; DIS?: VillageDecomposition; }

export async function loadDecompositionByVillage(): Promise<Map<string, DecompositionByChannel>> {
  return cached('decomposition_by_village', async () => {
    const rows = await loadVillagesDecomposition();
    const map = new Map<string, DecompositionByChannel>();
    for (const r of rows) {
      const entry = map.get(r.village_id) ?? {};
      entry[r.channel] = r;
      map.set(r.village_id, entry);
    }
    return map;
  });
}

export async function loadNonfarmByVillage(): Promise<Map<string, Record<string, number>>> {
  return cached('nonfarm_by_village', async () => {
    const rows = await loadNonfarmComponents();
    const map = new Map<string, Record<string, number>>();
    for (const r of rows) {
      const entry = map.get(r.village_id) ?? {};
      entry[r.component] = r.z_value;
      map.set(r.village_id, entry);
    }
    return map;
  });
}
