# Die Cutting Label Automation System

Sistem otomasi tata letak (layouting) presisi tinggi untuk industri pemotongan label (die-cutting), dirancang khusus untuk kebutuhan label IMEI, box elektronik, dan produksi massal lainnya.

## 🚀 Fitur Utama

- **Kontrol Presisi Industri**: Input angka akurat dalam satuan mm/cm untuk menjamin kesesuaian produk (Millimeter-Perfect).
- **Fleksibilitas Ukuran (Custom Dimension)**: 
    - Tanpa batas template kertas standar.
    - Pengaturan *Gap Management* (jarak antar label) untuk akomodasi pisau potong/sensor printer.
- **Logika Lembaran & Perforasi**: 
    - Deteksi otomatis batas halaman.
    - Penambahan garis sobek (perforasi) otomatis di setiap akhir lembaran.
- **Produksi Massal**: Kalkulasi otomatis jumlah label per halaman dan total halaman berdasarkan target produksi.
- **Output Vektor (jsPDF)**: Menghasilkan PDF vektor yang tidak pecah saat diperbesar, siap untuk mesin potong digital atau printer thermal industri.
- **Visualisasi Real-Time**: *Live preview* untuk meminimalisir kesalahan setting dan limbah bahan.
- **Dual Language Support**: Dukungan multibahasa (Bahasa Indonesia & English) dengan pengatur bahasa instan di antarmuka.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: ReactJS (Vite)
- **Styling**: Tailwind CSS
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi terbaru direkomendasikan)
- NPM atau Yarn

## ⚙️ Instalasi dan Pengaturan

1. **Clone repositori ini:**
   ```bash
   git clone [url-repositori]
   cd cutting-label
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Siapkan variabel lingkungan:**
   Salin `.env.example` menjadi `.env` (jika diperlukan konfigurasi tambahan).
   ```bash
   cp .env.example .env
   ```

4. **Jalankan aplikasi dalam mode pengembangan:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## 🏗️ Build untuk Produksi

Untuk menghasilkan build produksi yang dioptimalkan:
```bash
npm run build
```
Hasil build akan berada di direktori `dist/`.

## 📝 Update Log

### [2026-03-04] - Multi-Language Support & Documentation
- **Feature**: Implementasi dukungan dua bahasa (Indonesia & Inggris).
- **UI**: Penambahan tombol ganti bahasa (flag-only) di navbar.
- **Docs**: Pembaruan README.md dengan detail proyek dan panduan instalasi serta update log.
- **i18n**: Refaktorisasi teks hardcoded ke dalam sistem translasi `translations.ts`.
