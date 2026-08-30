// Since 2020 the four kabupaten in DIY use kalurahan/kapanewon; only Kota
// Yogyakarta still uses kelurahan/kecamatan. Using one form throughout reads
// as an outsider's mistake to the intended audience — see
// naskah_antarmuka_dashboard.md section 1, point 8. Every village-facing
// label must select the term from the village's own kabupaten.
const IS_KOTA_YOGYAKARTA = (kabupaten: string) => kabupaten.trim().toUpperCase() === 'YOGYAKARTA';

export function villageTerm(kabupaten: string): 'Kelurahan' | 'Kalurahan' {
  return IS_KOTA_YOGYAKARTA(kabupaten) ? 'Kelurahan' : 'Kalurahan';
}

export function districtTerm(kabupaten: string): 'Kecamatan' | 'Kapanewon' {
  return IS_KOTA_YOGYAKARTA(kabupaten) ? 'Kecamatan' : 'Kapanewon';
}

export function villageTermLower(kabupaten: string): 'kelurahan' | 'kalurahan' {
  return IS_KOTA_YOGYAKARTA(kabupaten) ? 'kelurahan' : 'kalurahan';
}

export function districtTermLower(kabupaten: string): 'kecamatan' | 'kapanewon' {
  return IS_KOTA_YOGYAKARTA(kabupaten) ? 'kecamatan' : 'kapanewon';
}

export function kabupatenLabel(kabupaten: string): string {
  return IS_KOTA_YOGYAKARTA(kabupaten) ? 'Kota Yogyakarta' : `Kabupaten ${titleCaseWord(kabupaten)}`;
}

function titleCaseWord(s: string): string {
  return s.toLowerCase().replace(/(^|\s)([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}
