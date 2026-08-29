// Classifies values using break thresholds precomputed offline (viz_config.breaks),
// never in the browser — per section 15 of the spec.
export function classIndex(value: number, breaks: number[]): number {
  let i = 0;
  while (i < breaks.length && value > breaks[i]) i++;
  return i;
}

export function classColor(value: number, breaks: number[], ramp: string[]): string {
  if (Number.isNaN(value)) return '#cfcfc7';
  return ramp[classIndex(value, breaks)] ?? ramp[ramp.length - 1];
}
