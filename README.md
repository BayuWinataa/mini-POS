# 🛍️ Mini Point of Sale (POS) Web Application

Aplikasi web **Mini Point of Sale (POS)** ritel full-stack yang responsif, aman, dan andal. Dibangun menggunakan Next.js 16 App Router, Prisma ORM, Neon Serverless PostgreSQL, Tailwind CSS, dan Vitest.

---

## 🌟 Fitur Utama

- **📦 Manajemen Produk (Katalog & Admin)**:
  - CRUD (Tambah, Edit, Lihat Produk).
  - Toggle Status Aktif / Non-aktif produk.
  - Indikator stok real-time (*Out of Stock* & *Low Stock Warning*).

- **🛒 Keranjang Belanja Interaktif**:
  - Penambahan & pengurangan kuantitas item dengan kontrol stok maksimal di UI.
  - Kalkulasi subtotal & total bayar real-time.
  - Hapus item individual atau bersihkan seluruh keranjang.

- **💳 Checkout & Transaksi Aman (Server-Side)**:
  - Validasi harga & ketersediaan stok 100% di **server-side** (mencegah manipulasi dari frontend).
  - Eksekusi atomic transaction menggunakan **Prisma `$transaction`** untuk mencegah *race condition* & stok negatif.
  - **Snapshot Harga Produk**: Harga produk saat transaksi disimpan ke record `TransactionItem` sehingga perubahan harga di masa mendatang tidak mengubah riwayat transaksi lama.
  - Ringkasan transaksi & cetak struk (*Print Receipt*).

- **📜 Riwayat Transaksi & Ekspor Laporan**:
  - Tabel riwayat transaksi terurut dari yang terbaru.
  - Filter & Pencarian berdasarkan No. Transaksi / Nama Produk.
  - Detail rincian item pesanan dalam modal.
  - **Ekspor Laporan Transaksi ke format CSV**.

- **🧪 Automated Testing**:
  - Memiliki **3 Test Suite (7 Pass Tests)** berbasis Vitest untuk menguji kalkulasi harga server-side, integritas stok, dan validasi status produk.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Database & ORM** | Prisma ORM + Neon PostgreSQL |
| **Styling & Icons** | Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Testing** | Vitest |
| **Package Manager** | pnpm |

---

## 🚀 Panduan Instalasi & Cara Menjalankan

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/BayuWinataa/mini-POS.git
cd mini-pos
pnpm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root project berdasarkan `.env.example`:
```env
DATABASE_URL="postgresql://user:password@ep-example-host.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Generate Prisma Client & Database Migration
```bash
npx prisma generate
npx prisma db push
```

*(Opsional) Seeding Data Produk Awal:*
```bash
pnpm db:seed
```

### 4. Menjalankan Aplikasi (Development Server)
```bash
pnpm dev
```
Buka browser di `http://localhost:3000`.

---

## 🧪 Menjalankan Automated Testing

Untuk menjalankan pengujian otomatis berbasis **Vitest**:
```bash
pnpm test
```
*Atau secara langsung:*
```bash
npx vitest run
```

---

## 📄 Dokumentasi Submission PDF

Dokumen teknis submission sesuai bobot penilaian recruitment dapat diakses di:
- **[SUBMISSION_OUTLINE.md](file:///c:/coba/mini-pos/SUBMISSION_OUTLINE.md)**
- **[AI_LOG.md](file:///c:/coba/mini-pos/AI_LOG.md)**
- **[ARCHITECTURE.md](file:///c:/coba/mini-pos/ARCHITECTURE.md)**
