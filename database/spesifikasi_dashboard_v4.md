# Dashboard Specification, version 4
## Terrain as a Barrier
### Dasbor prioritas desa untuk pengambil keputusan

**Supersedes:** version 3, which put the argument first and the priority last.
**Primary audience:** decision makers. Bappeda DIY, KPw Bank Indonesia DIY, OJK DIY, Diskominfo DIY, and kabupaten and kota governments.
**Secondary audience:** academic reviewers, who need the evidence chain to hold.
**Built on:** paper draft v12, `dashboard_master.csv` (438 villages), administrative boundary GeoJSON.
**Delivery:** static React. No export, no download, no server, no runtime estimation.
**Language:** Bahasa Indonesia.

---

## 0. The change, and why it inverts version 3

Version 3 opened with the research question and arrived at the priority in section 6. That order is correct for a reader who came to evaluate the argument. It is wrong for a reader who came to allocate a budget.

Version 4 inverts it. **The answer comes first, the evidence supports it below.** A kepala dinas who reads only the first screen should leave with something usable. A reviewer who scrolls past it finds the full chain intact, in the same order the paper makes it.

This is not a compromise between the two audiences. It is the order that serves both: decision makers stop early by design, reviewers continue by habit, and neither is asked to wade through the other's material first.

### The single most important addition

The five analytic category names do not survive contact with a policy meeting. `Prioritas Diagnostik Non-Terrain` describes a bootstrap result. It does not tell a kepala dinas what to do on Monday.

Every category therefore carries a **plain-language verb layer** that sits on top of the classification without changing it:

| Analytic category | What the reader sees | n |
|---|---|---|
| Prioritas Pasokan Ganda | **Bangun keduanya** | 48 |
| Prioritas Infrastruktur Digital | **Bangun konektivitas** | 3 |
| Prioritas Diagnostik Non-Terrain | **Periksa dulu** | 68 |
| Penguatan Struktural / Jangka Panjang | **Bangun ekonominya dulu** | 154 |
| Monitoring | **Pantau** | 165 |

The analytic name remains available on every village and in every methods section. It is not the primary label anywhere in the interface. This mapping lives in `lookup_actions_policy.csv`, which is new in v4 and carries, for each category, the verb, the question it answers, a plain-language description, the typical instrument, the lead actor, supporting actors, and a caution.

The four bands the verbs collapse into are the actual decision structure:

| Band | Meaning | n | Share |
|---|---|---|---|
| A | Tindakan pasokan sekarang | 51 | 11,6% |
| B | Diagnosis sebelum investasi | 68 | 15,5% |
| C | Penguatan jangka panjang | 154 | 35,2% |
| D | Pantau | 165 | 37,7% |

---

## 1. Structure

One vertical scroll. The first screen is self-contained.

```
  RINGKASAN     Satu layar. Cukup untuk mengambil keputusan awal.
  ─────────────────────────────────────────────
  1  Empat keputusan, 438 desa
  2  Di mana: peta prioritas
  3  Wilayah saya
  4  Profil desa
  5  Siapa mengerjakan apa
  ─────────────────────────────────────────────
  DASAR BUKTI   Mengapa klasifikasi ini dapat dipercaya
  6  Pertanyaan yang diuji
  7  Medan menekan aksesibilitas
  8  Dua kanal, satu ukuran            ← temuan utama naskah
  9  Dimensi kedua: ketetanggaan
  10 Desa mana yang terkendala medan
  11 Apa yang menahan kanal keuangan
  12 Batas tafsir
```

A thin persistent rail marks the boundary between `RINGKASAN` and `DASAR BUKTI`, with a single control at the boundary: `Lihat dasar buktinya`. The rail is the only navigation. There are no modes and no tabs.

The evidence half is the whole of version 3, reordered but not weakened. Nothing was cut from it. The academic argument is intact; it simply now sits below the answer rather than above it.

---

## 2. Ringkasan. The first screen

This screen must work alone. Assume the reader sees nothing else.

**Headline.** `51 dari 438 desa dan kelurahan di DIY memerlukan tindakan pasokan sekarang.`

**Subhead.** `48 di antaranya kekurangan akses keuangan formal dan infrastruktur digital sekaligus. 41 dari 48 berada di Gunungkidul.`

**The four bands, as a single horizontal bar of 438 units**, segmented A / B / C / D, with the verb label and count on each segment. Band A is drawn at full saturation; C and D recede. The bar is the entire visual. No chart furniture, no axis, no legend block separate from the bar itself.

**Beneath, four short cards**, one per band, each carrying the verb, the count, the question it answers, and the lead actor. From `lookup_actions_policy.csv`:

| Band | Verb | n | Question shown | Lead |
|---|---|---|---|---|
| A | Bangun keduanya · Bangun konektivitas | 51 | `Permintaan sudah ada dan pasokan kurang. Apa yang dibangun?` | Bappeda DIY, Diskominfo DIY |
| B | Periksa dulu | 68 | `Kekurangan nyata, tetapi bukan karena medan. Apa penyebabnya?` | Pemkab/Pemkot |
| C | Bangun ekonominya dulu | 154 | `Permintaan belum cukup menopang layanan. Apa yang membuatnya cukup?` | Dinas Koperasi dan UKM DIY |
| D | Pantau | 165 | `Tidak ada kebutuhan mendesak. Apa yang diawasi?` | Pemkab/Pemkot |

**One line of framing, below the cards, not above them.** `Klasifikasi ini berasal dari aturan deterministik atas data 438 desa. Tidak ada model prediksi baru.`

**One caution, on the same screen.** `Empat keputusan ini menyatakan urutan, bukan besaran anggaran. Penelitian ini tidak mengestimasi biaya intervensi.`

Putting the limitation on the summary screen rather than in a distant section is a deliberate cost. It slightly weakens the headline and it substantially protects the artifact, because the first misuse a priority list invites is treating it as a budget allocation.

---

## 3. Section 1. Empat keputusan, 438 desa

**Purpose.** Explain what each band means, in the reader's language, before showing them a map.

**Visual.** Four full-width blocks, one per band, in order. Each block contains, all from `lookup_actions_policy.csv`:

- The verb, large
- The count and share
- `plain_idn`, the plain-language description of the situation
- `instrument_idn`, the kind of instrument that fits
- `lead_actor` and `support_actors`
- `caution_idn`, in a smaller, marked register

The cautions matter more than the instruments. Band A's is `Label yang sama tidak berarti penyebab yang sama. Periksa diagnosis sumber gap desa sebelum menentukan bentuk intervensi.` Band C's is `Kategori ini bukan alasan untuk menunda. Ia menyatakan bahwa urutan intervensi dimulai dari sisi permintaan.` Both correct a misreading that a decision maker will otherwise make.

**The composition beat, inside band A.** The 48 dual-supply villages are not one problem. They break down as 30 residual on both channels, 8 residual with no dominance on digital, 5 residual with terrain on digital, 3 no dominance with terrain on digital, and 2 no dominance with residual on digital. Rendered as a small stacked bar with the caption: `Prioritas Pasokan Ganda hanya menyatakan bahwa kedua kanal kekurangan pasokan pada kondisi permintaan tinggi. Ia bukan rekomendasi untuk membangun jalan, kantor cabang, dan menara secara bersamaan.`

**Interaction.** None. This section is read, not operated.

---

## 4. Section 2. Di mana. Peta prioritas

**Purpose.** The single map that answers `di mana`.

**Visual.** DIY at village resolution, coloured by band, using the category hex values from the source data. Band A villages are drawn at full opacity with a visible outline; bands C and D are muted. The reader's eye should land on Gunungkidul without being told.

**Interaction.** A four-state segmented control at the top of the map: `Semua` / `Bangun sekarang` / `Periksa dulu` / `Bangun ekonominya`. Selecting a band isolates it and updates a count line beneath: `51 desa di 5 kabupaten/kota`. This is the only filter in the application.

**Concentration callouts, drawn on the map as small annotations rather than as a separate table:**

- Gunungkidul: 41 of the 48 dual-supply villages, 85,4 percent. Within Gunungkidul, 28,5 percent of all villages are dual supply priority.
- Kulon Progo: 49 of 88 villages in structural strengthening, 55,7 percent, the highest share in DIY.
- Kota Yogyakarta: zero villages in structural strengthening.
- The 51 band A villages concentrate in a handful of kapanewon: Semin 6, Ponjong 5, Rongkop 4, Saptosari 4, Tanjungsari 4, all in Gunungkidul, and Temon 3 in Kulon Progo.

The kapanewon concentration is worth surfacing explicitly. A kabupaten-level number tells a Pemda official the problem is theirs. A kapanewon-level number tells them where to send someone.

---

## 5. Section 3. Wilayah saya

**Purpose.** A Pemkab official does not administer DIY. This section reduces the province to their scope.

**Visual.** A five-way selector, `Bantul` / `Gunungkidul` / `Kulon Progo` / `Sleman` / `Kota Yogyakarta`, plus `Seluruh DIY`. Selecting one redraws the band bar and the map for that kabupaten only, and shows its band composition against the DIY average.

| Kabupaten | Bangun sekarang | Periksa dulu | Bangun ekonominya | Pantau |
|---|---|---|---|---|
| Bantul | 1 (1,3%) | 10 (13,3%) | 24 (32,0%) | 40 (53,3%) |
| Gunungkidul | 43 (29,9%) | 30 (20,8%) | 44 (30,6%) | 27 (18,8%) |
| Kulon Progo | 3 (3,4%) | 7 (8,0%) | 49 (55,7%) | 29 (33,0%) |
| Sleman | 1 (1,2%) | 6 (7,0%) | 37 (43,0%) | 42 (48,8%) |
| Kota Yogyakarta | 3 (6,7%) | 15 (33,3%) | 0 (0,0%) | 27 (60,0%) |

**One written line per kabupaten**, generated from templates and stored in `viz_config`, stating what that kabupaten's profile means. For example, for Kulon Progo: `Kulon Progo memiliki proporsi Penguatan Jangka Panjang tertinggi di DIY. Prioritas di sini lebih banyak berada pada penguatan basis ekonomi daripada ekspansi titik layanan.` For Kota Yogyakarta: `Kota Yogyakarta tidak memiliki desa pada kategori penguatan jangka panjang. Kekurangan yang muncul di sini bersifat diagnostik, bukan struktural.`

This is the section that converts a provincial study into five usable briefs, and it is the one most likely to determine whether the artifact gets used after the symposium.

---

## 6. Section 4. Profil desa

**Purpose.** From band, to kabupaten, to one village.

**Interaction.** A search field, `Cari desa atau kelurahan`, and selection from the map. Results also reachable by clicking any village.

**Output: a written brief, not a field list.** Four short paragraphs in the same order as the whole dashboard:

`**Tegalrejo**, Kapanewon Gedangsari, Gunungkidul.`

`Desa ini berada pada persentil ke-97 keterjalan medan dan persentil ke-8 aksesibilitas fisik di DIY, sehingga termasuk yang paling sulit dijangkau di provinsi ini.`

`Permintaan ekonomi relatif tinggi, tetapi ketersediaan rendah pada kedua kanal. Diagnosis sumber kesenjangan menempatkan komponen residual sebagai komponen dominan pada kanal keuangan formal dan pada kanal digital.`

`**Keputusan: Bangun keduanya.** Karena sumber kesenjangan pada kedua kanal bersifat residual dan bukan medan, verifikasi cakupan penyedia, desain layanan, dan kapasitas kelembagaan perlu mendahului belanja modal.`

`Aktor yang relevan untuk koordinasi: Bappeda DIY, KPw Bank Indonesia DIY, OJK DIY, Diskominfo DIY, Pemkab Gunungkidul, Kalurahan Tegalrejo.`

The fourth paragraph is the important one and it must be generated from the village's own constraint classes, not from its category alone. Two villages both labelled `Bangun keduanya` receive different fourth paragraphs if one is terrain-dominant on digital and the other is residual on both. This is what stops the brief from being a template with a name substituted in.

**One figure only.** A position strip showing this village on ruggedness and accessibility against the DIY distribution, with the kabupaten median marked. Every other value stays in the data.

**Template count.** Five category templates times three constraint-pattern variants for the action paragraph. Fifteen strings, stored in `viz_config`, approved by you before build.

---

## 7. Section 5. Siapa mengerjakan apa

**Purpose.** Answer `siapa` at the level of function, not just organisation name.

**Visual.** Five functions drawn as a cycle: `TARGET → CONNECT → FINANCE → STRENGTHEN → IMPLEMENT & MONITOR`, closing back through `Reklasifikasi`. Eleven actors sit inside their function, from `paper_results.actors`.

**Interaction.** Hovering a band from section 1 highlights the functions and actors relevant to it. Hovering a function highlights the bands it serves. This is the cross-reference a coordination meeting actually needs.

**Required caveat, prominent.** `Pemetaan aktor merupakan usulan fungsi koordinasi berbasis hasil penelitian, bukan penetapan kewenangan hukum. Mandat formal tetap perlu diverifikasi terhadap regulasi yang berlaku.`

**Closing line.** `Tipologi ini adalah snapshot analitis, bukan label permanen. Siklus Identifikasi, Diagnosis, Intervensi, Monitoring, dan Reklasifikasi dimaksudkan berulang seiring pembaruan data.`

---

## 8. Sections 6 to 12. Dasar bukti

The evidence half, carried over from version 3 without weakening. It opens with a boundary line: `Bagian berikut menjelaskan dasar empiris klasifikasi di atas. Pembaca yang hanya memerlukan prioritas tidak perlu melanjutkan.`

| # | Section | Core content |
|---|---|---|
| 6 | Pertanyaan yang diuji | The leapfrogging prediction stated as something that can fail. Two schematic paths, one bending around terrain, one drawn straight through the air in outline. |
| 7 | Medan menekan aksesibilitas | Pearson −0,441, Spearman −0,577, within-kabupaten partial −0,213, TRI on PAI −0,136 with p ≈ 0,003. Toggle between all-DIY and within-kabupaten fits. The weak-instrument statement, F-like 9,68, appears here, before the headline. |
| 8 | Dua kanal, satu ukuran | **The manuscript's headline.** FFAS 0,622 [0,167; 1,363], DIS 1,299 [0,822; 2,818], difference +0,677 with AR p = 0,0137 and confidence set [0,149; 1,961] clearing zero. The leapfrogging prediction is drawn as a hollow marker below FFAS; DIS animates in above it. Toggle to raw scale to show why standardisation is required for the comparison to be meaningful. |
| 9 | Dimensi kedua: ketetanggaan | rho 0,4673 and 0,3920, difference −0,0753 with 90 percent interval [−0,230; +0,148] containing zero. Drawn in the same visual grammar as section 8: one interval clears zero, one straddles it. |
| 10 | Desa mana yang terkendala medan | Nested sets: 64 terrain-dominant on digital, 7 on financial, all 7 inside the 64, zero on financial alone. Carries the caveat that the terrain component uses Stage 2 coefficients and is therefore not independent confirmation. |
| 11 | Apa yang menahan kanal keuangan | Non-farm base accounts for 79,7 percent of the effect on FFAS against 22,0 percent on DIS; livelihood shift 42,1 against 10,6. Drawn as a mirror against the section 10 counts. Carries the mechanism-consistent caveat. |
| 12 | Batas tafsir | The six manuscript limitations as six cards, plus the three robustness checks, plus the line that no estimation runs inside the dashboard. |

**Why section 9 stays at full weight even with decision makers as primary audience.** It reports where the difference disappears. A dashboard that showed only the confirming result would be advocacy, and the reviewers who will decide the competition outcome are in the secondary audience. Section 9 costs a decision maker nothing, since they have already stopped, and it is what makes the artifact defensible to the people who have not.

---

## 9. What changed from version 3

| Change | Reason |
|---|---|
| Priority moved from section 6 to the first screen | Decision makers are now the primary audience and they read the top |
| Plain-language verb layer added over the five categories | `Prioritas Diagnostik Non-Terrain` is not an instruction |
| Four decision bands introduced above the five categories | Five is one too many to hold in a meeting; four verbs map to four decisions |
| New section 3, Wilayah saya | A Pemkab official administers one kabupaten, not five |
| Kapanewon-level concentration surfaced | Kabupaten tells them it is their problem; kapanewon tells them where to go |
| Village brief now varies by constraint pattern, not category alone | Two villages with the same label can need different first moves |
| Cost caution moved onto the summary screen | The first misuse of a priority list is reading it as a budget |
| Evidence sections retained in full, relocated below | Nothing removed. Reviewers scroll; decision makers do not have to. |
| Still no export, download, or save control | Per standing instruction |

---

## 10. Data inventory

Sixteen build inputs. None is user-downloadable.

| File | New in v4 | Serves |
|---|---|---|
| `lookup_actions_policy.csv` | **yes** | Ringkasan, sections 1, 2, 3, 4, 5. Verb, band, question, plain description, instrument, lead and support actors, caution, colour, per category. |
| `paper_results.json` | v3 | Ringkasan counts, sections 5 and 6 to 12 |
| `villages_policy.csv` | v2 | Band assignment, map, section 3 |
| `villages_master.csv` | v2 | Search, labels, kapanewon aggregation |
| `villages_geography.csv` | v2 | Position strip, section 7 scatter |
| `villages_decomposition.csv` | v2 | Village brief action paragraph, section 10 |
| `villages_patterns.csv` | v2 | Section 10 map |
| `villages_typology.csv` | v2 | Supporting line in section 1 |
| `villages_outcomes.csv` | v2 | Village brief |
| `villages_demand.csv` | v2 | Section 11 |
| `villages_nonfarm_components.csv` | v2 | Section 11 reveal |
| `lookup_categories.csv` | v2 | Analytic names, retained but not primary |
| `lookup_labels.csv` | v2 | Indonesian rendering |
| `agg_kabupaten.csv` | v2 | Section 3 |
| `summary_headline.json` | v2 | Section 10 counts |
| boundary GeoJSON | — | All maps |

One aggregation is needed that does not yet exist: **band counts by kapanewon**, for the section 2 annotations. It is derivable from `villages_master.csv` and `villages_policy.csv` and should be precomputed rather than aggregated in the browser.

---

## 11. Conventions

Unchanged from version 3 except where noted.

**Colour.** The five category hex values from the source data carry through to the bands: `#B44734` and `#D58A2A` in band A, `#76558E` band B, `#35758A` band C, `#B8BEBA` band D. Band A therefore reads as two related warm tones against three cooler ones, which is correct, since band A is the only band that says build now.

**Typography.** Condensed grotesque for headings and counts. Humanist serif for running text, which is most of the summary half. Serif italic for village and kapanewon names. Monospace for coefficients and intervals, which now appear only in the evidence half. The summary half should contain no monospace at all: a decision maker screen with confidence intervals on it has failed.

**Number formatting.** Indonesian comma decimal in the interface. Counts as integers with no decimals in the summary half. Percentages to one decimal.

**Motion.** Three moments: the 438-unit bar segmenting into four bands on load, the DIS estimate crossing the leapfrogging prediction in section 8, and the nested sets resolving in section 10. All idempotent, all static under `prefers-reduced-motion`.

**Register.** The summary half is written in the second person implied, in imperatives and plain nouns. The evidence half is written in the manuscript's academic register. The shift at the boundary is deliberate and should be audible.

---

## 12. Open items

| # | Item | Blocks |
|---|---|---|
| 1 | **Approve the five verb labels and the four band names.** These become the vocabulary the artifact is remembered by, and they are mine, not yours. | Everything in the summary half |
| 2 | Approve the fifteen village-brief templates, five categories by three constraint patterns | Section 4 |
| 3 | Approve the five kabupaten one-line characterisations | Section 3 |
| 4 | Confirm the lead and support actor assignments per category in `lookup_actions_policy.csv`, which I derived from Tabel 6.1 but which assign a single lead where the paper assigns functions | Sections 1, 4, 5 |
| 5 | Confirm Tegalrejo, Gedangsari, Gunungkidul as the worked example, or nominate another | Section 4 |
| 6 | Sensitivity values for the rho difference at k = 5, 10, 15 and Queen | Section 9 interaction only |
| 7 | Precompute band counts by kapanewon | Section 2 annotations |
| 8 | Typeface selection within the stated roles | Build only |

---

## 13. Acceptance checklist

- [ ] A reader who sees only the first screen leaves with a usable priority
- [ ] No analytic category name appears as a primary label in the summary half
- [ ] No coefficient, confidence interval, or p-value appears in the summary half
- [ ] The cost caution appears on the summary screen, not in a later section
- [ ] Exactly one filter exists, the band selector in section 2
- [ ] No download, export, or save control exists anywhere
- [ ] Section 3 works for a reader who only administers one kabupaten
- [ ] The village brief varies by constraint pattern, not by category alone
- [ ] Band A's caution about identical labels with different causes is present in section 1
- [ ] Band C's caution against reading it as deferral is present in section 1
- [ ] The evidence boundary line appears before section 6
- [ ] Section 9's null result is given the same visual weight as section 8
- [ ] The Stage 2 dependency caveat is in section 10 body copy, not a footnote
- [ ] The mechanism-consistent caveat is in section 11 body copy
- [ ] The actor mapping carries its legal caveat
- [ ] All six limitations appear as a section
- [ ] Three animations only, all idempotent, all respecting reduced motion
- [ ] Every number traces to a build input file
- [ ] Legible in greyscale and under deuteranopia
