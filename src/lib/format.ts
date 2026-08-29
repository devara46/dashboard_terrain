export const MISSING = 'belum tersedia';

function localeNumber(x: number, dp: number, signed = false): string {
  const s = x.toFixed(dp).replace('.', ',');
  const withSign = signed && x > 0 ? '+' + s : s;
  return withSign.replace('-', '−');
}

export function fmtIndex(x: number | null | undefined, dp = 3, signed = false): string {
  if (x === null || x === undefined || Number.isNaN(x)) return MISSING;
  return localeNumber(x, dp, signed);
}

export function fmtCoef(x: number | null | undefined): string {
  if (x === null || x === undefined || Number.isNaN(x)) return MISSING;
  return localeNumber(x, 4, true);
}

export function fmtP(pDisplay: string | null | undefined): string {
  if (!pDisplay) return MISSING;
  return pDisplay;
}

export function fmtCoord(x: number): string {
  return x.toFixed(6);
}

export function fmtCount(n: number): string {
  return n.toLocaleString('id-ID');
}

export function isMissing(x: number | null | undefined): boolean {
  return x === null || x === undefined || Number.isNaN(x);
}

// Source place names arrive upper-case (BPS convention); the design system's
// italic-serif place-name convention reads better in title case. Display-only.
export function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|[\s/.-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}
