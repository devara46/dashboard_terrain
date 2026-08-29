export interface VillageMaster {
  village_id: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  urban_rural: string;
  urban_rural_code: string;
}

export interface VillageGeography {
  village_id: string;
  TRI: number;
  TRI_c: number;
  TRI_percentile_DIY: number;
  PAI: number;
  PAI_percentile_DIY: number;
}

export interface VillageOutcomes {
  village_id: string;
  FFAS_count: number;
  FFAS_std: number;
  DIS: number;
  DIS_std: number;
  DI_final: number;
  DI_std: number;
  MI_FFAS: number;
  MI_DIS: number;
}

export interface VillageDemand {
  village_id: string;
  demand_level_idn: string;
  DemandFamily: string;
  NonFarmEnt: number;
  LivelihoodShift: number;
  R906A: number;
}

export interface NonfarmComponentRow {
  village_id: string;
  component: string;
  z_value: number;
}

export type Quadrant = 'Well-served' | 'Priority Intervention' | 'Structurally Lagging' | 'Oversupplied';

export interface VillageTypology {
  village_id: string;
  Q_FFAS: Quadrant;
  q_ffas_idn: string;
  Q_DIS: Quadrant;
  q_dis_idn: string;
  ChannelPattern: string;
  channel_divergent: boolean;
}

export type Channel = 'FFAS' | 'DIS';
export type ConstraintClass = 'Terrain-constrained' | 'Residual-constrained' | 'No significant dominance';

export interface VillageDecomposition {
  village_id: string;
  channel: Channel;
  gap: number;
  gap_terrain: number;
  gap_residual: number;
  dominance_margin: number;
  ci_lo_terrain: number;
  ci_hi_terrain: number;
  ci_lo_residual: number;
  ci_hi_residual: number;
  ci_lo_dominance: number;
  ci_hi_dominance: number;
  pr_terrain_abs_dominates: number;
  pr_residual_abs_dominates: number;
  pr_terrain_positive: number;
  pr_residual_positive: number;
  constraint_class: ConstraintClass;
  constraint_class_short: string;
  constraint_reason: string;
  constraint_class_idn: string;
}

export interface VillagePattern {
  village_id: string;
  TerrainPattern: string;
  ConstraintPattern: string;
}

export interface VillagePolicy {
  village_id: string;
  priority_order: number;
  immediate_priority: boolean;
  priority_channel: 'NONE' | 'BOTH' | 'FFAS' | 'DIS';
  dashboard_category_idn: string;
  dashboard_policy_tier_idn: string;
  Stage5_Category: string;
  Stage5_PolicyTier: string;
}

export interface LookupCategory {
  category_key: string;
  Stage5_Category: string;
  dashboard_category_idn: string;
  Stage5_PolicyTier: string;
  dashboard_policy_tier_idn: string;
  Stage5_Action: string;
  Stage5_Action_IDN: string;
  category_color_hex: string;
  priority_order: number;
  n_villages: number;
}

export interface LookupLabel {
  field: string;
  value_en: string;
  value_idn: string;
}

export interface AggKabupaten {
  kabupaten: string;
  n_villages: number;
  mean_TRI: number;
  mean_PAI: number;
  mean_FFAS_count: number;
  mean_DIS: number;
  n_ffas_terrain: number;
  n_dis_terrain: number;
  n_both_terrain: number;
  n_immediate_priority: number;
  n_channel_divergent: number;
}

export interface SummaryHeadline {
  n_villages: number;
  n_ffas_terrain: number;
  n_dis_terrain: number;
  n_both_terrain: number;
  n_dis_only_terrain: number;
  n_ffas_only_terrain: number;
  n_ffas_residual: number;
  n_dis_residual: number;
  n_immediate_priority: number;
  n_dual_supply_priority: number;
  n_dual_supply_priority_gunungkidul: number;
  n_channel_divergent: number;
  pct_channel_divergent: number;
  mean_tri_pct_dis_terrain: number;
  mean_pai_pct_dis_terrain: number;
}

export interface VizConfig {
  breaks: Record<string, { method: string; values: number[]; outlierBound?: number }>;
  ramps: Record<string, string[] | Record<string, string> | { low_outlier: string; classes: string[]; high_outlier: string }>;
  labels: Record<string, string>;
  definitions: Record<string, string>;
  sources_note: string;
  interpretive_boundary: string;
  version: { dashboard_version: string; data_build_date: string; placeholder: boolean };
}

export interface VillageGeomFeature {
  type: 'Feature';
  properties: { village_id: string };
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
}

export interface VillageGeomCollection {
  type: 'FeatureCollection';
  features: VillageGeomFeature[];
}
