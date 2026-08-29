# Dashboard Specification, version 2
## Terrain as a Barrier: Geographic Constraints on Digital Financial Access at the Village Level in DIY

**Supersedes:** version 1, which was written before the analytical output was available.
**Built on:** `dashboard_master.csv`, 438 rows, 101 columns, plus an administrative boundary GeoJSON.
**Delivery:** static React, no server, no runtime estimation.
**Interface language:** Bahasa Indonesia. Field names preserved from source.

---

## 0. What changed and why

Version 1 assumed a dashboard built around 2SLS coefficients, a first-stage F, a Wald coefficient-equality test, mediation paths, and a robustness matrix. None of those quantities are in the delivered data. What is in the data is different and, for a dashboard, better suited: a complete village-level classification produced by a supply-gap decomposition with bootstrap support.

Every panel in version 1 that depended on model-level output is removed. Every panel below is buildable from the delivered columns without exception.

| Version 1 panel | Status |
|---|---|
| A. Hero, Wald equality test | **Replaced.** No Wald statistic in the data. New hero in section 2. |
| B. Geografi dasar | Retained, rebuilt on `TRI`, `PAI`, `FFAS_count`, `DIS` |
| C. Identifikasi, first stage and bad controls | **Removed.** No coefficients, no specification variants |
| D. Dua kanal satu instrumen | **Replaced** by the constraint-pattern panel |
| E. Mekanisme, mediation paths | **Replaced** by the non-farm component profile, which is estimable from the nine `z_` columns |
| F. NTL and BUI quadrant | **Replaced.** No NTL or BUI columns. `DI_final` exists without components. The quadrant that does exist is the demand and supply typology, and that is now the quadrant map. |
| G. Uji ketahanan | **Removed.** No robustness variants in the data |
| H, I, J. Targeting, village card, sources | Retained, rebuilt on the delivered policy columns |

Your earlier instruction that the quadrant appears as a map only is preserved. The quadrant it now applies to is `Q_FFAS` and `Q_DIS`, the demand and supply typology, and it is rendered as a map in the evidence mode with no filter, facet, or table column anywhere in the application.

---

## 1. The central problem to resolve before build

The delivered data does not show symmetric terrain constraints. It shows a strong asymmetry, and the asymmetry runs against the digital channel.

| Quantity | Value |
|---|---|
| Villages where terrain dominates the FFAS supply gap | **7** of 438 |
| Villages where terrain dominates the DIS supply gap | **64** of 438 |
| Villages terrain-constrained on FFAS but not on DIS | **0** |
| Villages terrain-constrained on both | 7 |
| Villages terrain-constrained on DIS only | 57 |

Terrain constraint on the financial channel is a strict subset of terrain constraint on the digital channel. There is no village in DIY where terrain binds formal financial access without also binding digital infrastructure. That is a clean nesting structure and it is the most striking thing in the file.

It also points the opposite way from the paper's stated headline, which is the symmetric-constraint result with a Wald p of approximately 0,489.

The two are not necessarily contradictory. The Wald test compares average marginal effects of accessibility across channels. The decomposition asks, village by village, which component dominates the observed supply gap and whether the bootstrap supports that dominance. Equal average elasticities can coexist with very different counts of terrain-dominant villages if the residual component has different dispersion across the two channels, and the FFAS residual here is clearly larger: 238 villages are residual-dominant on FFAS against 181 on DIS.

**This has to be reconciled in writing before the dashboard ships, because a supplementary artifact that says "medan lebih mengikat kanal digital" while the paper says "hambatan simetris" will be read as an inconsistency, and a reviewer will find it.** The reconciliation is a paragraph, not a re-analysis, but it has to exist and it has to appear in the dashboard as well as the paper.

Until you confirm the framing, the specification below is written for the asymmetric reading, because that is what the delivered data supports on its own terms.

---

## 2. Hero finding

**Recommendation: the nesting asymmetry, stated as a claim about where terrain actually binds.**

Eyebrow: `Temuan utama`
Headline: `Medan mengikat kanal digital, bukan kanal keuangan formal.`
Subhead: `Dari 438 desa dan kelurahan di DIY, medan menjadi komponen dominan kesenjangan pasokan pada 64 desa untuk infrastruktur digital, tetapi hanya pada 7 desa untuk akses keuangan formal. Tidak ada satu pun desa yang terkendala medan pada kanal keuangan formal tanpa sekaligus terkendala medan pada kanal digital.`

### Primary visual: nested sets

Two nested regions on a single canvas, not a Venn diagram of equal circles. The DIS terrain-constrained set is drawn as a region of 64 units, the FFAS set as a region of 7 units fully contained inside it, and the remaining 374 villages as a light field surrounding both. Counts labelled inside each region. The containment is the finding and the geometry should make it unmissable.

Beneath the figure, one line in the data face:
`64 desa terkendala medan pada kanal digital. 7 di antaranya juga terkendala medan pada kanal keuangan formal. 0 desa terkendala medan hanya pada kanal keuangan formal.`

### Supporting validation strip

Three numbers in a row, drawn from `summary_headline.json`, which give the finding external plausibility on the same screen:

| Value | Label |
|---|---|
| 88,4 | `Rata-rata persentil keterjalan medan pada desa yang terkendala medan (kanal digital)` |
| 28,1 | `Rata-rata persentil aksesibilitas fisik pada desa yang sama` |
| 0 | `Desa di Kota Yogyakarta yang terkendala medan pada kanal mana pun` |

The classification puts the terrain-constrained villages at the 88th percentile of ruggedness and the 28th percentile of accessibility. That the classification recovers this without being told to is the strongest single defence of the method, and it belongs on the hero screen rather than buried in a methods panel.

### Secondary hero, the policy number

`51` desa dan kelurahan prioritas segera
`48` di antaranya memerlukan penguatan pada kedua kanal sekaligus
`41` dari 48 berada di Kabupaten Gunungkidul

The concentration is the operational finding. Eighty five percent of dual-channel supply priority in DIY sits in one kabupaten. For a Bank Indonesia or Pemda reader this is the sentence that survives the meeting.

### Rejected alternatives

| Candidate | Why not |
|---|---|
| Residual dominance as hero: 238 FFAS and 181 DIS villages are residual-constrained | It is the largest category and it is honest, but it is a statement about what the study cannot identify. It belongs in Panel D as a prominent qualification, not as the headline of a paper about terrain. |
| The demand and supply quadrant distribution | Descriptive, and every prior YES entry has an equivalent |
| Channel divergence, 156 of 438 at 35,6 percent | Strong second-order finding, and it is Panel E. As a hero it does not say what the divergence is caused by. |

### Data bindings
All hero values read from `summary_headline.json`. No computation in the browser.

---

## 3. Information architecture

```
Header
  Judul ringkas | Mode: [ Bukti ] [ Sasaran ] | Unduh data | Tentang

MODE BUKTI
  A  Temuan utama
  B  Medan dan aksesibilitas
  C  Kuadran permintaan dan ketersediaan
  D  Dekomposisi kesenjangan pasokan
  E  Divergensi antar kanal
  F  Basis ekonomi non-pertanian

MODE SASARAN
  G  Daftar prioritas
  H  Kartu desa
  I  Batas tafsir dan sumber data
```

Hash routing, one stable address per panel, so the manuscript can cite a specific panel in Lampiran.

---

## 4. Panel B. Medan dan aksesibilitas

**Purpose.** Establish that ruggedness and physical accessibility covary, before any classification is shown.

**Visual.** Two elements side by side.

Left: scatter of `TRI_percentile_DIY` against `PAI_percentile_DIY`, one point per village, coloured by `kabupaten` using the fixed categorical palette. Points where `Class_DIS` equals `Terrain-constrained` are drawn with a heavier outline, so the reader sees them cluster in the lower right before the classification is explained.

Right: four small choropleths on identical breaks: `TRI`, `PAI`, `FFAS_count`, `DIS`. Linked hover across all four and across the scatter.

**Caption.** `Keterjalan medan dan aksesibilitas fisik bergerak berlawanan arah. Desa yang kemudian diklasifikasikan terkendala medan pada kanal digital terkonsentrasi pada kombinasi keterjalan tinggi dan aksesibilitas rendah.`

**Binding.** `villages_geography.csv`, `villages_outcomes.csv`, `villages_master.csv`, `villages_decomposition.csv`.

**Required treatment for DIS.** `DIS` takes only 38 distinct values across 438 villages and ranges from -13,21 to +10,28. Quantile classification will fail on ties and an equal-interval scheme will be swamped by eight extreme villages. Use fixed manual breaks defined in `viz_config`, and render the eight villages outside the range of -5 to +5 in a separate top and bottom class with an explicit legend entry rather than letting them stretch the ramp. Those villages are Girikarto, Balong, and Nglindur in Gunungkidul at the low end, and Sinduadi, Caturtunggal, Condongcatur, Maguwoharjo, and Purwomartani in Sleman at the high end. The Sleman cluster is the Depok and Ngaglik student and commercial belt, which is a real phenomenon and not an artifact, but it should be shown as an outlier class rather than allowed to define the colour scale for the other 430 villages.

---

## 5. Panel C. Kuadran permintaan dan ketersediaan

**Purpose.** Present the demand and supply typology as a map, per your instruction that the quadrant appears as a map only.

**Standing notice, not dismissible.**
`Kuadran pada peta ini bersifat deskriptif. Kuadran disusun dari posisi relatif indeks permintaan terhadap ketersediaan layanan, dan tidak digunakan sebagai variabel dalam estimasi mana pun.`

**Visual.** One interactive choropleth with a channel switch. The switch has two states, `Kanal keuangan formal` bound to `Q_FFAS`, and `Kanal infrastruktur digital` bound to `Q_DIS`. Four classes with the Indonesian labels already carried in `q_ffas_idn` and `q_dis_idn`:

| Class | Label | FFAS n | DIS n |
|---|---|---|---|
| Well-served | `Terlayani Baik` | 128 | 143 |
| Priority Intervention | `Prioritas Intervensi` | 91 | 76 |
| Structurally Lagging | `Tertinggal Struktural` | 108 | 115 |
| Oversupplied | `Ketersediaan Relatif Tinggi` | 111 | 104 |

**Important labelling note.** The English `Oversupplied` and the Indonesian `Ketersediaan Relatif Tinggi` are not the same claim. `Ketersediaan Relatif Tinggi` is the defensible one and should be the only label shown in the interface. Do not surface the English value anywhere in the UI, because a Pemda reader who sees a village labelled oversupplied will read it as an instruction to withdraw provision. `lookup_labels.csv` holds the mapping and the interface reads the Indonesian side only.

**Demand is a single village attribute, not two.** `DemandFamily_FFAS` and `DemandFamily_DIS` are identical in every row and `DemandConsistency` is true for all 438. The split file collapses them to one `DemandFamily` column. The interface must present demand as one property of the village, shown once, not as a per-channel property, because showing it twice implies a distinction the data does not contain.

**Binding.** `villages_typology.csv`, `villages_demand.csv`, boundary GeoJSON.

---

## 6. Panel D. Dekomposisi kesenjangan pasokan

**Purpose.** The methodological core. Explain that each village's supply gap is split into a terrain component and a residual component, and that a village is classified only when the bootstrap supports dominance.

### D1. How to read one village
An anatomy figure using a single named village as the worked example. Recommended: **Kebon Harjo, Kulon Progo**, which sits at the 100th percentile of ruggedness and the 13th percentile of accessibility and is terrain-constrained on both channels. Drawn as a horizontal bar broken into its terrain and residual components, with the bootstrap interval for each drawn as a bracket, and the dominance margin marked.

Labels: `Komponen medan`, `Komponen residual`, `Selang kepercayaan bootstrap`, `Margin dominasi`.

Caption: `Setiap desa memiliki kesenjangan pasokan yang diuraikan menjadi komponen medan dan komponen residual. Desa diklasifikasikan terkendala medan hanya jika komponen medan mendominasi dan dominasi tersebut didukung selang kepercayaan bootstrap.`

### D2. The three classes, per channel
Two stacked bars, one per channel, showing the class distribution, with the Indonesian labels from `constraint_ffas_idn` and `constraint_dis_idn`:

| Class | FFAS | DIS |
|---|---|---|
| `Dominan Medan` | 7 | 64 |
| `Dominan Residual / Non-Terrain` | 238 | 181 |
| `Tidak Ada Dominasi Signifikan` | 193 | 193 |

### D3. The honest qualification
This panel must state, in body copy and not in a footnote, that the residual category is the largest on the financial channel:

`Pada kanal keuangan formal, komponen residual mendominasi pada 238 desa, jauh melampaui 7 desa dengan dominasi medan. Komponen residual tidak mengidentifikasi penyebab. Ia mencakup cakupan penyedia dan agen, desain layanan, keterjangkauan, kapasitas kelembagaan, serta faktor lain yang tidak dipisahkan dalam dekomposisi ini. Temuan bahwa medan jarang mendominasi kanal keuangan formal adalah temuan tentang medan, bukan pernyataan bahwa kesenjangan tersebut kecil.`

Placing this prominently is a defensive requirement. A reviewer who finds it themselves will treat the whole artifact as overstated.

### D4. Cross-classification
A 3 by 3 matrix, `Class_FFAS` against `Class_DIS`, with counts in cells and the empty row visually emphasised.

|  | DIS: Tidak Ada Dominasi | DIS: Residual | DIS: Medan |
|---|---|---|---|
| **FFAS: Tidak Ada Dominasi** | 104 | 49 | 40 |
| **FFAS: Residual** | 89 | 132 | 17 |
| **FFAS: Medan** | 0 | 0 | 7 |

The bottom row is the hero finding in tabular form. The two zeros carry it.

### D5. Constraint pattern map
Choropleth of `TerrainPattern`, three classes:

| Value | Label | n |
|---|---|---|
| Neither channel terrain-constrained | `Tidak Ada Kanal Terkendala Medan` | 374 |
| DIS terrain-constrained only | `Hanya Kanal Digital Terkendala Medan` | 57 |
| Both channels terrain-constrained | `Kedua Kanal Terkendala Medan` | 7 |

Kabupaten breakdown available on hover from `agg_kabupaten.csv`. Gunungkidul holds 33 of the 57 DIS-only villages and Kulon Progo holds 4 of the 7 dual villages. Kota Yogyakarta has zero in either constrained class.

**Do not surface `pr_terrain_positive` in the interface.** It takes only two values on FFAS, 0,003 and 0,997, and two on DIS, 0 and 1. Presented as a probability it will read as a rendering bug. If the sign information is needed, render it as a directional indicator, not as a number.

**Binding.** `villages_decomposition.csv`, `villages_patterns.csv`, `agg_kabupaten.csv`.

---

## 7. Panel E. Divergensi antar kanal

**Purpose.** Show that the two channels do not move together, which is the finding that makes a single-index approach to financial inclusion inadequate.

**Headline value.** 156 of 438 villages, 35,6 percent, occupy different quadrants on the two channels.

**Visual.** A four-node flow diagram from `Q_FFAS` to `Q_DIS`, ribbon widths proportional to counts, with the diagonal (same quadrant, 282 villages) drawn in a muted tone and the off-diagonal ribbons drawn at full strength.

Largest transitions, all read from `villages_typology.csv`:

| From (FFAS) | To (DIS) | n |
|---|---|---|
| Ketersediaan Relatif Tinggi | Tertinggal Struktural | 46 |
| Prioritas Intervensi | Terlayani Baik | 43 |
| Tertinggal Struktural | Ketersediaan Relatif Tinggi | 39 |
| Terlayani Baik | Prioritas Intervensi | 28 |

**Caption.** `Lebih dari sepertiga desa menempati kuadran yang berbeda pada kedua kanal. Kebijakan yang menargetkan inklusi keuangan melalui satu indeks gabungan akan salah sasaran pada kelompok desa ini.`

**Naming.** `channel_divergent` and `leapfrogging_divergent` are identical columns. The split file keeps `channel_divergent` only. Do not use the word leapfrogging as a UI label for this variable. Divergence between quadrants is not evidence of leapfrogging and the label would assert something the panel does not test.

---

## 8. Panel F. Basis ekonomi non-pertanian

**Purpose.** The demand-side mechanism, expressed through the nine components that build `NonFarmEnt`.

**Visual.** Two elements.

Left: a component profile for the selected village, nine horizontal bars in standardised units, with the DIY mean at zero marked. Components, with display labels:

| Field | Label |
|---|---|
| `kelompok_pertokoan` | `Kelompok pertokoan` |
| `pasar_permanen` | `Pasar permanen` |
| `pasar_semi_permanen` | `Pasar semi permanen` |
| `minimarket` | `Minimarket` |
| `restoran` | `Restoran` |
| `warung_makan` | `Warung makan` |
| `toko_kelontong` | `Toko kelontong` |
| `industri_mikro` | `Industri mikro` |
| `sentra_industri` | `Sentra industri` |

Right: `NonFarmEnt` against `PAI`, scatter, with the terrain-constrained villages outlined, showing the accessibility gradient in the non-farm economy.

**Sparse component warning.** Four of the nine components are near-degenerate: `pasar_permanen` and `pasar_semi_permanen` each take 3 distinct values, `sentra_industri` takes 4, and `kelompok_pertokoan` takes 7. Their bars will be identical across large blocks of villages. Render them in a lower-emphasis tone with a legend note `komponen dengan sebaran terbatas`, so a reader does not interpret repeated values as an error.

**Livelihood.** `LivelihoodShift` is exactly the indicator that `R906A` is not equal to 1, so the two carry the same information. The interface should show one of them. `R906A` needs a confirmed meaning before it appears in any label. It is currently unlabelled and takes values 1, 2, and 3 with counts 308, 21, and 109.

**Binding.** `villages_nonfarm_components.csv`, `villages_demand.csv`, `villages_geography.csv`.

---

## 9. Panel G. Daftar prioritas

**Purpose.** The working list.

**The rule, stated above the table.** The delivered data already carries a complete five-category classification with priority ordering, so the dashboard does not construct a rule. It displays the one that exists and states it:

| priority_order | Category | Tier | n | Immediate |
|---|---|---|---|---|
| 1 | `Prioritas Pasokan Ganda` | `Prioritas pasokan tinggi` | 48 | yes |
| 1 | `Prioritas Infrastruktur Digital` | `Prioritas pasokan spesifik kanal` | 3 | yes |
| 2 | `Prioritas Diagnostik Non-Terrain` | `Prioritas diagnostik` | 68 | no |
| 3 | `Penguatan Struktural / Jangka Panjang` | `Penguatan jangka panjang` | 154 | no |
| 4 | `Monitoring / Tidak Perlu Ekspansi Segera` | `Monitoring / tanpa ekspansi segera` | 165 | no |

Note that `priority_order` 1 contains two distinct categories and 51 villages, which is the source of the `immediate_priority` flag. The interface should group them under one heading, `Prioritas segera`, with the two categories as subheadings, rather than presenting five flat rows that hide the shared ordering.

**Table columns.**

| Column | Field | Format |
|---|---|---|
| Desa/Kelurahan | `desa` | serif italic |
| Kecamatan | `kecamatan` | body |
| Kabupaten/Kota | `kabupaten` | body |
| Keterjalan (persentil) | `TRI_percentile_DIY` | data face, 1 dp, inline distribution strip |
| Aksesibilitas (persentil) | `PAI_percentile_DIY` | data face, 1 dp, inline distribution strip |
| Kendala keuangan formal | `constraint_class_idn` where channel is FFAS | chip |
| Kendala infrastruktur digital | `constraint_class_idn` where channel is DIS | chip |
| Kategori | `dashboard_category_idn` | chip with `category_color_hex` |

Default sort: `priority_order` ascending, then `TRI_percentile_DIY` descending.

**Filters.**

| Filter | Field | Control |
|---|---|---|
| Kabupaten/Kota | `kabupaten` | multi-select, 5 options |
| Kategori kebijakan | `dashboard_category_idn` | multi-select, 5 options |
| Prioritas segera | `immediate_priority` | toggle |
| Kanal prioritas | `priority_channel` | multi-select: NONE 319, BOTH 48, FFAS 43, DIS 28 |
| Pola kendala medan | `TerrainPattern` | multi-select, 3 options |
| Tingkat permintaan | `demand_level_idn` | segmented, Tinggi 219, Rendah 219 |
| Perkotaan / perdesaan | `urban_rural` | segmented, Perkotaan 323, Perdesaan 115 |
| Divergen antar kanal | `channel_divergent` | toggle, 156 true |

No quadrant filter, per the standing decision.

Active filters render as removable chips with a live count in the form `Menampilkan 48 dari 438 desa dan kelurahan`. Empty state: `Tidak ada desa yang memenuhi kombinasi filter ini. Kurangi satu filter untuk melihat hasil.`

**Export.** `Unduh hasil filter (CSV)`, visible rows and visible columns only, with a header comment carrying the source citation, retrieval date, and dashboard version.

**Companion map.** Linked selection between table and map, filtered villages highlighted against a muted province fill.

---

## 10. Panel H. Kartu desa

Addressable at `#/sasaran/desa/[village_id]`.

1. **Identity.** `desa`, `kecamatan`, `kabupaten`, `urban_rural`.
2. **Position strip.** `TRI_percentile_DIY` and `PAI_percentile_DIY` as strip plots against the DIY distribution with the kabupaten median marked. `FFAS_count`, `DIS`, `DI_final`, `MI_FFAS`, `MI_DIS` shown as standardised values with the same treatment.
3. **Quadrant line.** `q_ffas_idn` and `q_dis_idn` as read-only text, with `ChannelPattern` beneath. Not a control.
4. **Decomposition block, one per channel.** The terrain and residual components with their bootstrap intervals, the dominance margin, the resulting class from `constraint_class_idn`, and the reason from `constraint_reason` translated to Indonesian. This is the block that makes the classification auditable per village and it is the most valuable single element in the targeting mode.
5. **Component profile.** The nine non-farm bars from Panel F for this village.
6. **Recommended action.** `Stage5_Action_IDN`, pulled from `lookup_categories.csv` by the village's category rather than stored per village.
7. **Provenance line.** `Seluruh nilai pada kartu ini adalah indeks turunan dan hasil klasifikasi. Tidak ada catatan mentah dari PODES yang ditampilkan.`

**Excluded.** No estimated welfare, income, poverty, or consumption figure of any kind.

---

## 11. Panel I. Batas tafsir dan sumber data

Two blocks.

**Interpretive boundary.** Reproduce, in Bahasa Indonesia, the constraint that the analysis carries:

`Dasbor ini menyajikan hasil klasifikasi deskriptif dan diagnostik pada tingkat desa. Klasifikasi kendala menunjukkan komponen mana yang mendominasi kesenjangan pasokan di setiap desa, bukan besaran efek kausal. Kesimpulan mengenai perbandingan sensitivitas kedua kanal terhadap aksesibilitas didasarkan pada hasil estimasi variabel instrumen yang dilaporkan dalam naskah, bukan pada klasifikasi di dasbor ini.`

This paragraph is the mechanism that keeps the dashboard and the manuscript consistent while section 1 is being resolved. It must be written before build, not after.

**Source table.** Producer, year, resolution, dissemination level, level used, licence, reference, for each of PODES, DEMNAS, VIIRS, Sentinel-2, OpenStreetMap, BPS boundaries. Followed by the dissemination statement:

`Seluruh variabel tingkat desa bersumber dari data yang dapat didiseminasikan pada tingkat desa. SAKERNAS hanya dapat didiseminasikan pada tingkat kabupaten dan kota, dan SUSENAS tidak dapat dikaitkan secara spasial di bawah tingkat kabupaten dan kota. Keduanya tidak digunakan sebagai variabel tingkat desa. Yang dipublikasikan pada dasbor ini adalah indeks turunan dan hasil klasifikasi, bukan catatan sumber.`

---

## 12. Split file inventory

The master file is split into twelve tables plus one summary object, all joined on `village_id`. Column names are preserved from the source except in `villages_decomposition.csv`, where the channel suffix moves into a `channel` column. Files are in `data/`.

| File | Rows | Cols | Key | Contents |
|---|---|---|---|---|
| `villages_master.csv` | 438 | 6 | `village_id` | Names, kabupaten, kecamatan, urban and rural classification |
| `villages_geography.csv` | 438 | 6 | `village_id` | `TRI`, `TRI_c`, `PAI` and their DIY percentiles |
| `villages_outcomes.csv` | 438 | 9 | `village_id` | `FFAS_count`, `DIS`, `DI_final`, their standardised forms, `MI_FFAS`, `MI_DIS` |
| `villages_demand.csv` | 438 | 6 | `village_id` | `demand_level_idn`, `DemandFamily`, `NonFarmEnt`, `LivelihoodShift`, `R906A` |
| `villages_nonfarm_components.csv` | 3.942 | 3 | `village_id` + `component` | Long format, nine components per village |
| `villages_typology.csv` | 438 | 7 | `village_id` | `Q_FFAS`, `Q_DIS`, their Indonesian labels, `ChannelPattern`, `channel_divergent` |
| `villages_decomposition.csv` | 876 | 20 | `village_id` + `channel` | Gap, terrain and residual components, bootstrap intervals, dominance probabilities, class and reason |
| `villages_patterns.csv` | 438 | 3 | `village_id` | `TerrainPattern`, `ConstraintPattern` |
| `villages_policy.csv` | 438 | 8 | `village_id` | `priority_order`, `immediate_priority`, `priority_channel`, category and tier |
| `lookup_categories.csv` | 5 | 10 | `category_key` | Category names in both languages, tier, full action text, colour, village count |
| `lookup_labels.csv` | 16 | 3 | `field` + `value_en` | English to Indonesian mapping for every classified field |
| `agg_kabupaten.csv` | 5 | 11 | `kabupaten` | Precomputed kabupaten summaries for map hover and Panel D5 |
| `summary_headline.json` | - | - | - | The sixteen values the hero and validation strip read |

### Columns removed in the split, and why

| Removed | Reason |
|---|---|
| `source_nmkec`, `source_nmkab` | Identical to `kecamatan` and `kabupaten` |
| `FFAS_count_1D`, `FFAS_count_2D` | Identical to `FFAS_count` |
| `DIS_1D`, `DIS_2D` | Identical to `DIS` |
| `Q_FFAS_c`, `Q_DIS_c` | Identical to `Q_FFAS` and `Q_DIS` |
| `Class_FFAS_count` | Identical to `Class_FFAS` |
| `leapfrogging_divergent` | Identical to `channel_divergent`, and the name asserts a conclusion the column does not test |
| `DemandFamily_DIS` | Identical to `DemandFamily_FFAS` in all 438 rows |
| `DemandConsistency` | Constant true |
| `enrichment_status` | Constant `COMPLETE` |
| `missing_enrichment_fields` | Empty in all 438 rows |
| `Stage5_Action`, `Stage5_Action_IDN`, `category_color_hex` | Moved to `lookup_categories.csv`. Five distinct strings repeated across 438 rows accounted for a large share of file size. |

Thirteen identical column pairs were present in the source. If the pipeline that produced the master file is still in use, that duplication is worth removing upstream rather than at the dashboard boundary.

---

## 13. Formats and conventions

**Identifiers.** `village_id` is a ten-character string. It is quoted in every CSV and parsed as a string in the browser. It is never cast to a number at any point.

**Encoding.** UTF-8 with byte order mark, so the files open correctly in Excel under an Indonesian locale. Comma separator, period as decimal mark in the files. Indonesian comma decimal formatting is applied at render time only, never in storage.

**Geometry.** The administrative boundary GeoJSON is simplified with a topology-preserving algorithm to under 2 MB for all 438 polygons, converted to TopoJSON with quantisation, and stripped of every property except `village_id`. All attributes join client-side. This keeps the geometry file stable across data revisions.

**Projection.** Geometry served in EPSG:4326. Any area or distance quantity that appears anywhere in the manuscript or the dashboard is computed in EPSG:32749 upstream and never derived from the web layer.

**Missing values.** Empty in CSV, `null` in JSON. Rendered as `belum tersedia`, never as zero or blank.

**Precision.** Percentiles 1 decimal. Standardised indices 3 decimals. Bootstrap bounds 3 decimals. Rounding at render, not in storage.

**Configuration.** `viz_config.json` holds class breaks, ramps, display labels, technical term definitions, and the version string. Both the dashboard and the manuscript figure script read it, so that a break value revised in one place cannot diverge between the paper and the artifact.

**Colour.** The source carries `category_color_hex` with five values: `#B8BEBA` monitoring, `#35758A` long-term strengthening, `#76558E` diagnostic priority, `#B44734` dual supply priority, `#D58A2A` digital infrastructure priority. Adopt these for the policy categorical scale. Continuous ramps for `TRI`, `PAI`, `FFAS_count`, and `DIS` are defined separately in `viz_config` and must not reuse any of the five, so that a categorical chip and a continuous fill are never confusable. All scales checked under deuteranopia and in greyscale, because panels will be screenshotted into a document that may be printed in monochrome.

**Typography.** Condensed grotesque for panel titles and numeric callouts, humanist serif for running text, serif italic for village and kecamatan names, monospace for values and identifiers. Setting place names in italic and figures in monospace lets a reader identify what kind of value they are looking at before reading it.

**Motion.** One orchestrated moment, in the hero, where the nested regions resolve from a single undifferentiated field of 438 into the 374, 57, 7 structure. Nothing else animates beyond state transitions under 150 milliseconds. `prefers-reduced-motion` renders the final state directly.

---

## 14. Open items

| # | Item | Blocks |
|---|---|---|
| 1 | **Reconcile the asymmetry in the decomposition with the symmetric-constraint headline in the manuscript.** Confirm which claim the dashboard leads with, and supply the paragraph that reconciles them. | Panel A, Panel I, and the coherence of the whole artifact |
| 2 | Confirm the meaning and value labels of `R906A` | Panel F, `villages_demand.csv` |
| 3 | Confirm whether the eight `DIS` outlier villages are to be shown as a separate class or excluded from the ramp | Panel B |
| 4 | Confirm the Indonesian rendering of the four `Class_reason` strings, which are currently English only | Panel H block 4 |
| 5 | Confirm that the English quadrant labels, in particular `Oversupplied`, are suppressed everywhere in the interface | Panel C |
| 6 | Confirm whether any model-level output, first stage, IV estimates, or Wald statistic, will be supplied for the dashboard, or whether the manuscript carries them alone | Whether an evidence panel on estimation is added at all |
| 7 | Choice of the two typefaces within the roles specified | Build only |

---

## 15. Acceptance checklist

- [ ] Every panel renders from the twelve split files and the summary object, with no computation beyond formatting and filtering
- [ ] `village_id` is a string in every file and in every browser parse
- [ ] The interpretive boundary paragraph in Panel I is written and approved before deployment
- [ ] The residual-dominance qualification in Panel D3 appears in body copy, not a footnote
- [ ] English classification labels, in particular `Oversupplied`, appear nowhere in the interface
- [ ] The word leapfrogging is not used as a label for `channel_divergent`
- [ ] `pr_terrain_positive` is not rendered as a number
- [ ] Quadrant appears as a map in Panel C only, and in no filter, facet, or table column
- [ ] `DIS` uses fixed manual breaks with a declared outlier class
- [ ] Sparse non-farm components are visually marked as limited in spread
- [ ] Demand is presented as one village attribute, not two channel-specific ones
- [ ] Missing values render as `belum tersedia`
- [ ] CSV export carries citation, retrieval date, and version
- [ ] Reduced motion respected, keyboard focus visible, contrast at WCAG AA
- [ ] All panels legible in greyscale and under deuteranopia simulation
