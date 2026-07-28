# Product Requirement Document (PRD) - Mini Point of Sale (POS)

## 1. Overview & Goal
Mini Point of Sale (POS) adalah aplikasi manajemen penjualan ritel full-stack sederhana, responsif, dan andal. Aplikasi ini dirancang untuk mengelola ketersediaan produk, memproses transaksi secara real-time dengan kalkulasi server-side yang terisolasi, menjaga integritas stok, serta menyediakan riwayat dan ekspor transaksi.

---

## 2. Tech Stack & Environment Architecture

| Layer | Technology Choice | Description |
|---|---|---|
| **Framework** | Next.js 16 (App Router, React 19, TypeScript) | Server Actions, React Server Components |
| **Database & ORM** | Prisma ORM + Neon Serverless PostgreSQL | Serverless PostgreSQL dengan ACID transaction support |
| **Styling & UI** | Tailwind CSS v4 + Lucide Icons + Framer Motion 
| **Testing** | Vitest | Fast unit & integration testing untuk business logic server-side |
| **Deployment** | Vercel | Production deployment dengan environment variable integration |

---

## 3. Data Model & Schema Specifications

### `Product`
- `id` (String / UUID, Primary Key)
- `name` (String, Required)
- `price` (Decimal / Int in IDR, Required, > 0)
- `stock` (Int, Required, >= 0)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime, Default: now())
- `updatedAt` (DateTime, UpdatedAt)

### `Transaction`
- `id` (String / UUID, Primary Key)
- `transactionNumber` (String, Unique, e.g. `TRX-YYYYMMDD-XXXX`)
- `totalAmount` (Decimal / Int, Required)
- `itemCount` (Int, Required)
- `createdAt` (DateTime, Default: now())

### `TransactionItem`
- `id` (String / UUID, Primary Key)
- `transactionId` (String, Foreign Key -> `Transaction.id`, Cascade Delete)
- `productId` (String, Foreign Key -> `Product.id`)
- `productName` (String, Snapshot at checkout)
- `price` (Decimal / Int, Snapshot price at checkout)
- `quantity` (Int, Required, > 0)
- `subtotal` (Decimal / Int, `price * quantity`)

---

## 4. Detailed Feature Requirements

### 4.1 Product Management (Manajemen Produk)
- **Tampilan**: Tabel/Grid produk dengan pencarian nama & filter status (Semua / Aktif / Nonaktif).
- **Tambah Produk**: Form modal dengan validasi (Nama required, Harga > 0, Stok >= 0).
- **Edit Produk**: Mengubah Nama, Harga, Stok, dan Status.
- **Toggle Status**: Mengaktifkan atau menonaktifkan produk secara cepat. Produk non-aktif tidak muncul di katalog kasir.

### 4.2 Keranjang Belanja (Cart System)
- **Tambah Item**: Memilih produk aktif dari katalog kasir ke keranjang.
- **Kuantitas Item**: Tombol (+), (-), dan manual input.
- **Validasi Stok Di Client**: Mencegah penambahan kuantitas melebihi stok produk yang tersedia di state.
- **Subtotal & Total**: Kalkulasi realtime subtotal per item dan total belanja.
- **Hapus Item**: Hapus item individual atau bersihkan seluruh keranjang (Clear Cart).

### 4.3 Checkout & Order Processing
- **Validasi Server-Side (Krusial)**:
  - Backend mengambil ulang harga & stok produk terbaru langsung dari database.
  - Memverifikasi apakah semua produk masih aktif dan stok mencukupi.
- **Integritas Transaksi (Atomic Transaction)**:
  - Menggunakan Prisma `$transaction` untuk menjamin transaksi & pengurangan stok berhasil secara bersamaan.
  - Mencegah stok menjadi bernilai negatif (*race condition prevention*).
  - Mengunci (*snapshot*) harga produk pada saat checkout ke `TransactionItem.price`. Perubahan harga produk di kemudian hari **TIDAK** memengaruhi nilai transaksi historis.
- **Ringkasan Checkout (Order Summary Modal)**:
  - Menampilkan modal sukses dengan rincian transaksi, nomor transaksi, daftar item, dan total bayar.
  - Opsi langsung cetak struk (Print Receipt) atau transaksi baru.

### 4.4 Riwayat & Ekspor Transaksi (Transaction History & Export)
- **Daftar Transaksi**: Tabel riwayat transaksi terurut berdasarkan tanggal terbaru.
- **Filter & Search**: Mencari berdasarkan nomor transaksi atau rentang tanggal.
- **Detail Transaksi Modal**: Menampilkan rincian item, kuantitas, harga snapshot, dan subtotal.
- **Export Riwayat Transaksi**: Fitur ekspor data transaksi ke format CSV / Print summary untuk laporan.

---

## 5. Non-Functional & Quality Standards

1. **Handling Loading & Empty States**:
   - Skeleton loader saat memuat data katalog dan riwayat.
   - UI Empty State khusus (misal: "Keranjang Belanja Kosong", "Belum Ada Transaksi", "Produk Tidak Ditemukan").
2. **Input Validation & Error Handling**:
   - Validasi skema menggunakan Zod di Server Actions / API Routes.
   - Toast notification interaktif untuk pesan sukses & error.
3. **Automated Testing Suite (Vitest)**:
   - **Test 1 (Unit)**: Kalkulasi total transaksi & snapshot harga.
   - **Test 2 (Integration)**: Validasi kecukupan stok & penolakan checkout jika stok kurang.
   - **Test 3 (Integration)**: Atomic transaction & pembaruan stok produk setelah checkout.

---

## 6. Deliverables & Submission Checklist

- [x] Repository GitHub publik.
- [ ] Database PostgreSQL di-host di Neon / Supabase.
- [ ] Deployment di Vercel dengan environment variables `.env` terkonfigurasi.
- [ ] File `.env.example` terlampir di repo.
- [ ] Minimum 3 Vitest Automated Tests passing.
- [ ] Document README.md komprehensif.
- [ ] Document Submission PDF sesuai struktur kriteria penilaian.
