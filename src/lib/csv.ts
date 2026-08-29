// Minimal RFC4180 CSV parser: quoted fields, embedded commas/newlines, BOM-safe.
export function parseCsv(text: string): Record<string, string>[] {
  const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\r') { /* skip, handled by \n */ }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

  const filtered = rows.filter((r) => !(r.length === 1 && r[0] === ''));
  if (filtered.length === 0) return [];
  const header = filtered[0];
  return filtered.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => { obj[h] = r[i] ?? ''; });
    return obj;
  });
}

export function num(v: string | undefined): number {
  return v === undefined || v === '' ? NaN : Number(v);
}
export function numOrNull(v: string | undefined): number | null {
  return v === undefined || v === '' ? null : Number(v);
}
export function bool(v: string | undefined): boolean {
  return v?.toLowerCase() === 'true';
}
