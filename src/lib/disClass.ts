import type { VizConfig } from './types';

export type DisClassIndex = 'low_outlier' | 0 | 1 | 2 | 3 | 4 | 'high_outlier';

// DIS ranges from -13.2 to +10.3 across 438 villages but only 8 sit outside
// [-5, 5]; classifying the other 430 on that full range would flatten the
// ramp. Fixed manual breaks inside the bound, two named outlier classes
// outside it. See spesifikasi_dashboard_v2.md section 4.
export function disClass(value: number, config: VizConfig): DisClassIndex {
  const spec = config.breaks.DIS;
  const bound = spec.outlierBound ?? 5;
  if (value < -bound) return 'low_outlier';
  if (value > bound) return 'high_outlier';
  const [b0, b1, b2, b3] = spec.values;
  if (value <= b0) return 0;
  if (value <= b1) return 1;
  if (value <= b2) return 2;
  if (value <= b3) return 3;
  return 4;
}

export function disColor(value: number, config: VizConfig): string {
  const ramp = config.ramps.dis_with_outliers as { low_outlier: string; classes: string[]; high_outlier: string };
  const cls = disClass(value, config);
  if (cls === 'low_outlier') return ramp.low_outlier;
  if (cls === 'high_outlier') return ramp.high_outlier;
  return ramp.classes[cls];
}
