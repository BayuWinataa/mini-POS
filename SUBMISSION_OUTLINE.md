# Outlining Dokumentasi Submission (PDF Draft)

Dokumen ini merupakan kerangka dasar (*outline*) untuk file **Dokumentasi Submission (Format PDF)** yang berbobot **15% dari total penilaian technical test**.

---

## Struktur Bab Dokumentasi Submission PDF

### Bab 1: Gambaran Aplikasi (Overview)
- Latar belakang & deskripsi Mini Point of Sale (POS).
- Solusi yang ditawarkan: Manajemen produk, keranjang interaktif, transaksi server-side yang aman, dan riwayat penjualan.
- Screenshot / Preview UI Aplikasi.

### Bab 2: Arsitektur Aplikasi dan Database
- Diagrams Arsitektur Full-Stack (Next.js App Router + Prisma ORM + Neon PostgreSQL).
- Entity Relationship Diagram (ERD) & Struktur Tabel (`Product`, `Transaction`, `TransactionItem`).
- Penjelasan alur *Server-side Price Calculation* & *Atomic `$transaction`*.

### Bab 3: Teknologi yang Digunakan & Alasan Pemilihan
- **Next.js 16**: Server Components & Server Actions untuk performa dan keamanan.
- **Prisma + Neon PostgreSQL**: Kemudahan ORM, ACID transactions untuk integritas stok, dan integrasi serverless DB.
- **Tailwind CSS v4 + Framer Motion**: Kecepatan styling dan animasi UX yang modern.
- **Vitest**: Framework testing otomatis yang ringan dan sangat cepat.

### Bab 4: Fitur Selesai vs Belum Selesai
- **Fitur Selesai (100%)**:
  - Manajemen Produk (CRUD, Toggle Aktif/Nonaktif).
  - Keranjang Belanja (Hitung Subtotal & Total, Limiter Stok).
  - Checkout & Struk (Server validation, Price Snapshot, Deduct Stock).
  - Riwayat Transaksi & Ekspor CSV.
- **Fitur Belum Selesai**: None (Semua requirement utama terpenuhi).

### Bab 5: Keputusan Teknis & Trade-Offs
- **Trade-Off tanpa Authentication**: Mengesampingkan Auth untuk memfokuskan 100% energi pada keandalan transaksi, validasi server-side, kualitas UI/UX, dan ketersediaan automated tests.
- **Snapshot Harga Produk**: Menyimpan nama & harga produk pada transaksi alih-alih me-referensi dinamis ke tabel produk, untuk menjaga keakuratan transaksi historis.

### Bab 6: Testing yang Dilakukan
- Laporan hasil eksekusi 3 Automated Test Suites (Vitest):
  1. `transaction.test.ts` (Calculations & Price Snapshots) -> PASS
  2. `stock.test.ts` (Stock Decrements & Negative Stock Block) -> PASS
  3. `product.test.ts` (Status Inactive Rejection) -> PASS
- Ringkasan Pengujian Manual (UI/UX, Responsive, Loading & Empty States).

### Bab 7: Asumsi terhadap Requirement
- Asumsi mata uang menggunakan Rupiah (IDR).
- Asumsi stok selalu bertipe integer non-negatif.
- Asumsi transaksi yang sudah selesai tidak dapat dibatalkan (non-refundable) demi kesederhanaan sistem POS ritel.

### Bab 8: Penggunaan AI
- Ringkasan dari file `AI_LOG.md` (Tools AI yang dipakai, area bantuan AI, metode verifikasi, dan penyesuaian output AI).

### Bab 9: Keterbatasan Aplikasi & Rencana Pengembangan
- **Keterbatasan**: Belum mendukung multi-cabang (multi-store) dan sistem manajemen role pengguna (Manager vs Kasir).
- **Rencana Pengembangan Future Roadmap**:
  - Integrasi Payment Gateway (QRIS / E-Wallet).
  - Modul Analytics & Chart Laporan Penjualan Harian/Bulanan.
  - Fitur Barcode Scanner via Kamera Web.
