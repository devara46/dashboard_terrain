# Naskah Antarmuka Dashboard
## Terrain as a Barrier, YES 2026

Companion to specification v4. This document holds every Indonesian string in the interface, revised so that none of it reads as English rendered into Indonesian. `lookup_actions_policy.csv` has been rewritten to match.

---

## 1. Patterns removed, and why they gave the drafts away

Eight habits made the earlier copy read as translation. They are listed here because they will recur every time new strings are written, and recognising them is more useful than the corrections below.

**1. Noun stacking.** English compresses modifiers in front of a noun; Indonesian resolves them with prepositions and relative clauses. `tindakan pasokan sekarang` is three nouns doing the work of a clause. Indonesian expects `penanganan ketersediaan layanan dalam waktu dekat`.

**2. Headline juxtaposition across a comma.** `Dua kanal, satu ukuran` and `Satu desa, satu cerita` are an English editorial device. Indonesian headings state the subject: `Perbandingan sensitivitas kedua kanal`, `Profil desa`.

**3. Colon-then-reveal in headings.** `Di mana: peta prioritas` is an English magazine construction. Indonesian uses a plain noun phrase.

**4. Sentence fragments for emphasis.** `Justru sebaliknya.` standing alone is an English rhetorical beat. Indonesian formal register completes the sentence: `Hasilnya justru menunjukkan arah sebaliknya.`

**5. Colloquial particles in a formal register.** `dulu` and dangling `-nya` belong to conversation, not to a document a Bappeda official forwards. Use `dahulu`, and let the noun stand: `Lihat dasar bukti`, not `Lihat dasar buktinya`.

**6. Possessive framing borrowed from product English.** `Wilayah saya` is `My area` with Indonesian words. Indonesian labels the content: `Gambaran per kabupaten dan kota`.

**7. Loanwords where a native form is standard in policy writing.** `ekspansi` becomes `perluasan`, `monitoring` becomes `pemantauan`, `diagnostik` as an adjective survives but `diagnose` as a verb becomes `telusuri` or `diagnosis lanjutan`. The exception is terminology the manuscript has fixed, such as `kanal`, `residual`, `leapfrogging`, and `backhaul`, which stay for consistency with the paper.

**8. Wrong administrative vocabulary for DIY.** This is the one that will be noticed fastest by the intended readers. Since 2020, the four kabupaten in DIY use **kalurahan** and **kapanewon**; only Kota Yogyakarta uses **kelurahan** and **kecamatan**. Writing `Desa Tegalrejo, Kecamatan Gedangsari` marks the author as an outsider to a Yogyakarta audience. The interface must select the term from the village's kabupaten, not use one form throughout. `desa` remains correct as a generic analytical term in the evidence half.

One open decision: the manuscript uses the English word `dashboard`. Keep `dashboard` in the interface for consistency rather than switching to `dasbor`, unless you prefer to change the manuscript too.

---

## 2. Ringkasan, the first screen

**Judul**
`51 dari 438 desa dan kelurahan di DIY memerlukan penanganan ketersediaan layanan dalam waktu dekat.`

**Subjudul**
`Pada 48 di antaranya, akses keuangan formal dan infrastruktur digital sama-sama tertinggal. Sebanyak 41 dari 48 desa tersebut berada di Gunungkidul.`

**Label empat pita**

| Pita | Label | Jumlah |
|---|---|---|
| A | Perlu penanganan segera | 51 |
| B | Perlu diagnosis lebih dahulu | 68 |
| C | Perlu penguatan jangka panjang | 154 |
| D | Cukup dipantau | 165 |

The four labels are parallel in construction, three beginning `Perlu` and the fourth breaking the pattern to mark that it requires nothing. That parallelism is what makes them memorable in a meeting.

**Keterangan dasar klasifikasi**
`Klasifikasi ini dihasilkan dari aturan yang telah ditetapkan atas data 438 desa dan kelurahan, bukan dari model prediksi baru.`

**Peringatan penggunaan**
`Keempat kategori ini menunjukkan urutan penanganan, bukan besaran anggaran. Penelitian ini tidak menghitung biaya intervensi.`

---

## 3. Kosakata keputusan

Revised from the earlier draft. `Bangun ekonominya dulu` was too colloquial for the register, and `Bangun keduanya` left the referent unstated.

| Kategori analitis | Label keputusan | Jumlah |
|---|---|---|
| Prioritas Pasokan Ganda | **Tangani kedua kanal** | 48 |
| Prioritas Infrastruktur Digital | **Perkuat konektivitas** | 3 |
| Prioritas Diagnostik Non-Terrain | **Telusuri penyebabnya** | 68 |
| Penguatan Struktural / Jangka Panjang | **Perkuat ekonomi lokal** | 154 |
| Monitoring | **Pantau** | 165 |

All five are imperative verbs, which is what a decision label should be, and none of them requires the reader to know what a bootstrap interval is.

**Pertanyaan yang dijawab tiap kategori**

- Tangani kedua kanal: `Permintaan ekonomi sudah memadai, tetapi ketersediaan kedua kanal masih rendah. Kanal mana yang perlu didahulukan?`
- Perkuat konektivitas: `Kekurangan terjadi pada kanal digital dan bersumber dari kondisi medan. Apakah lokasi ini layak secara teknis?`
- Telusuri penyebabnya: `Kekurangan ketersediaan nyata, tetapi tidak bersumber dari kondisi medan. Apa penyebabnya?`
- Perkuat ekonomi lokal: `Permintaan ekonomi belum memadai untuk menopang layanan. Apa yang perlu diperkuat lebih dahulu?`
- Pantau: `Tidak ditemukan kebutuhan penambahan ketersediaan yang mendesak. Apa yang perlu diawasi?`

**Peringatan tiap kategori**

- Tangani kedua kanal: `Kategori yang sama tidak berarti penyebab yang sama. Periksa diagnosis sumber kesenjangan pada setiap desa sebelum menentukan bentuk intervensi.`
- Perkuat konektivitas: `Hanya terdapat tiga desa pada kategori ini. Verifikasi lapangan jauh lebih murah daripada keputusan investasi yang hanya bersandar pada indeks.`
- Telusuri penyebabnya: `Kategori residual hanya menyatakan bahwa penyebabnya bukan kondisi medan. Ia tidak menunjukkan penyebab yang spesifik.`
- Perkuat ekonomi lokal: `Kategori ini bukan alasan untuk menunda. Ia menunjukkan bahwa penanganan sebaiknya dimulai dari sisi permintaan.`
- Pantau: `Tipologi ini merupakan potret analitis pada satu titik waktu. Desa dapat berpindah kategori pada pembaruan data berikutnya.`

---

## 4. Judul bagian

| # | Judul lama | Judul revisi |
|---|---|---|
| 1 | Empat keputusan, 438 desa | `Empat jenis keputusan untuk 438 desa` |
| 2 | Di mana: peta prioritas | `Peta prioritas antar-desa` |
| 3 | Wilayah saya | `Gambaran per kabupaten dan kota` |
| 4 | Satu desa, satu cerita | `Profil desa` |
| 5 | Siapa mengerjakan apa | `Pembagian peran antar-lembaga` |
| 6 | Pertanyaan | `Pertanyaan yang diuji` |
| 7 | Medan menekan aksesibilitas | `Keterjalan medan dan aksesibilitas fisik` |
| 8 | Dua kanal, satu ukuran | `Perbandingan sensitivitas kedua kanal` |
| 9 | Dimensi kedua: ketetanggaan | `Dependensi spasial antar-desa` |
| 10 | Desa mana yang terkendala medan | `Sebaran desa yang terkendala medan` |
| 11 | Apa yang menahan kanal keuangan | `Mekanisme ekonomi pada kanal keuangan formal` |
| 12 | Batas tafsir | `Batas tafsir` (unchanged) |

**Rel navigasi:** `RINGKASAN` and `DASAR BUKTI`.

**Kendali batas:** `Lihat dasar bukti`

**Kalimat batas**
`Bagian berikut menjelaskan dasar empiris klasifikasi di atas. Pembaca yang hanya memerlukan daftar prioritas tidak perlu melanjutkan.`

---

## 5. Bagian 6, pertanyaan yang diuji

`Layanan keuangan digital sering digambarkan mampu melewati hambatan geografis. Kantor cabang memerlukan jalan, sedangkan aplikasi tidak.`

`Akan tetapi, infrastruktur digital juga memerlukan lokasi menara, backhaul, pasokan listrik, dan akses pemeliharaan.`

`Apabila digitalisasi benar-benar melewati geografi, infrastruktur digital seharusnya kurang terikat pada aksesibilitas fisik dibandingkan akses keuangan formal.`

`Penelitian ini menguji prediksi tersebut pada 438 desa dan kelurahan di DIY.`

Label diagram: `Prediksi leapfrogging (ketergantungan pada aksesibilitas lebih lemah)`

---

## 6. Bagian 8, temuan utama

**Judul**
`Digitalisasi tidak melewati hambatan geografis.`

**Subjudul**
`Pada skala simpangan baku yang sama, pengaruh aksesibilitas fisik terhadap infrastruktur digital justru lebih besar daripada terhadap akses keuangan formal. Selisihnya sebesar 0,677 dengan p = 0,0137, dan seluruh confidence set 95 persen berada di atas nol.`

The earlier draft ended the headline with a fragment, `Justru sebaliknya.` The word `justru` now does that work inside a complete sentence, which is how Indonesian carries the same emphasis.

**Label prediksi:** `Yang diprediksi leapfrogging: sensitivitas kanal digital lebih rendah`
**Label hasil:** `Yang ditemukan: sensitivitas kanal digital lebih tinggi`

**Kendali skala**
`Tampilkan skala asli`
`Pada skala asli, kedua koefisien tidak dapat dibandingkan karena FFAS dan DIS memiliki satuan yang berbeda. Perbandingan baru sah setelah keduanya dinyatakan dalam simpangan baku.`

---

## 7. Bagian 9, dependensi spasial

`Kanal digital lebih sensitif terhadap kondisi aksesibilitas di desa itu sendiri, tetapi tidak menunjukkan keterkaitan antar-desa yang lebih kuat. Hambatan digital dalam penelitian ini bersifat setempat, bukan bersifat jaringan.`

`Selisih rho sebesar −0,0753 dengan interval 90 persen dari −0,230 sampai 0,148. Karena interval tersebut memuat nol, besar dependensi spasial kedua kanal tidak dapat dibedakan secara statistik.`

---

## 8. Bagian 10 dan 11, peringatan wajib

**Bagian 10, ketergantungan pada Stage 2**
`Komponen medan dalam dekomposisi ini dihitung menggunakan koefisien Stage 2. Diagnosis ini memetakan sebaran spasial dari mekanisme yang telah diestimasi, bukan konfirmasi yang berdiri sendiri.`

**Bagian 10, salah tafsir yang paling mungkin**
`Ketiadaan label terkendala medan tidak berarti medan tidak berpengaruh. Klasifikasi hanya menyatakan apakah komponen medan lebih dominan daripada komponen residual, dengan dukungan interval bootstrap 90 persen atas 1.000 replikasi.`

**Bagian 11, mekanisme**
`Mediator tidak diacak dan desain penelitian tidak memenuhi asumsi mediasi kausal penuh. Hasil ini merupakan diagnosis yang konsisten dengan mekanisme, bukan estimasi mediasi kausal.`

---

## 9. Bagian 3, kalimat per kabupaten dan kota

One sentence each, generated from templates.

**Gunungkidul**
`Hampir tiga dari sepuluh kalurahan di Gunungkidul memerlukan penanganan segera pada kedua kanal sekaligus. Konsentrasi ini merupakan yang tertinggi di DIY.`

**Kulon Progo**
`Kulon Progo memiliki proporsi penguatan jangka panjang tertinggi di DIY, yaitu 49 dari 88 kalurahan. Penanganan di wilayah ini lebih mengarah pada penguatan basis ekonomi daripada perluasan titik layanan.`

**Bantul**
`Sebagian besar kalurahan di Bantul cukup dipantau. Hanya satu kalurahan yang memerlukan penanganan segera.`

**Sleman**
`Profil Sleman menyerupai Bantul, dengan porsi penguatan jangka panjang yang sedikit lebih besar.`

**Kota Yogyakarta**
`Kota Yogyakarta tidak memiliki kelurahan pada kategori penguatan jangka panjang. Kekurangan ketersediaan yang muncul di wilayah ini bersifat diagnostik, bukan struktural.`

Note the terminology shifts correctly across the five: `kalurahan` for the four kabupaten, `kelurahan` for Kota Yogyakarta.

---

## 10. Bagian 4, profil desa

Worked example, Tegalrejo, Gedangsari, Gunungkidul. Note the administrative terms.

`**Kalurahan Tegalrejo**, Kapanewon Gedangsari, Kabupaten Gunungkidul.`

`Kalurahan ini berada pada persentil ke-97 untuk keterjalan medan dan persentil ke-8 untuk aksesibilitas fisik, sehingga termasuk wilayah yang paling sulit dijangkau di DIY.`

`Permintaan ekonomi tergolong tinggi, tetapi ketersediaan kedua kanal masih rendah. Dekomposisi sumber kesenjangan menempatkan komponen residual sebagai komponen dominan, baik pada kanal keuangan formal maupun pada kanal digital.`

`**Keputusan: tangani kedua kanal.** Karena sumber kesenjangan tidak berasal dari kondisi medan, verifikasi cakupan penyedia, desain layanan, dan kapasitas kelembagaan perlu dilakukan sebelum belanja modal.`

`Lembaga yang perlu berkoordinasi: Bappeda DIY, KPw Bank Indonesia DIY, OJK DIY, Diskominfo DIY, Pemerintah Kabupaten Gunungkidul, dan Pemerintah Kalurahan Tegalrejo.`

**Kolom pencarian:** `Cari kalurahan atau kelurahan`

---

## 11. Bagian 5, pembagian peran

**Peringatan wajib**
`Pemetaan lembaga ini merupakan usulan fungsi koordinasi berdasarkan hasil penelitian, bukan penetapan kewenangan hukum. Mandat formal tetap perlu diverifikasi terhadap peraturan yang berlaku.`

**Kalimat penutup**
`Tipologi ini merupakan potret analitis, bukan label permanen. Siklus identifikasi, diagnosis, intervensi, pemantauan, dan reklasifikasi dimaksudkan berulang seiring pembaruan data.`

Note `pemantauan` rather than `monitoring` in running text. The English form is retained only where it names the analytic category in the evidence half.

---

## 12. Bagian 12, penutup

`Dashboard ini membaca hasil yang dihitung sepenuhnya di luar aplikasi. Tidak ada estimasi statistik yang dijalankan di dalam dashboard.`

---

## 13. Yang perlu Anda putuskan

1. **Kosakata keputusan.** The five imperative labels in section 3 are mine. `Tangani kedua kanal` and `Telusuri penyebabnya` in particular set the register for the whole artifact.
2. **Nama pita.** `Perlu penanganan segera`, `Perlu diagnosis lebih dahulu`, `Perlu penguatan jangka panjang`, `Cukup dipantau`.
3. **`dashboard` atau `dasbor`.** The manuscript uses `dashboard`. I have kept it. Changing it means changing the manuscript too.
4. **Konsistensi kalurahan dan kapanewon.** Confirm the interface should switch terms by kabupaten rather than using `desa` and `kecamatan` throughout. This affects the village brief, the search field, the kabupaten sentences, and every map tooltip.
5. **Istilah teknis yang dipertahankan.** `kanal`, `residual`, `leapfrogging`, `backhaul`, `confidence set`, `bootstrap`, `rho` are kept as in the manuscript. Confirm none of these should be localised for the policy half.
