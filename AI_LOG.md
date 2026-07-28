# AI Usage Documentation Log - Mini Point of Sale (POS)

Sesuai dengan ketentuan technical test recruitment (poin *Penggunaan AI*), dokumen ini mencatat pengunaan AI-assisted development tools dalam pembangunan aplikasi web Mini POS ini.

---

## 1. Tools AI yang Digunakan

- **Antigravity AI Agent** (Powered by DeepMind / Gemini 3.6 Flash).
- **Fungsi Utama**: Pair-programming, arsitektur sistem, pembuatan skema DB, penulisan Server Actions, komponen React, serta suite automated testing.

---

## 2. Bagian Pekerjaan yang Dibantu AI

| Bagian Pekerjaan | Kontribusi & bantuan AI |
|---|---|
| **Perencanaan & Dokumentasi** | Penyusunan `PRD.md`, `ARCHITECTURE.md`, `TEST_PLAN.md`, `SUBMISSION_OUTLINE.md`, dan struktur dokumen submission PDF. |
| **Skema Database & ORM** | Perancangan skema Prisma (`Product`, `Transaction`, `TransactionItem`) dan penentuan tipe data snapshot. |
| **Backend & Business Logic** | Implementasi Server Actions dengan validasi **Zod** dan **Prisma Atomic Transaction (`$transaction`)** untuk pencegahan stok negatif & snapshot harga. |
| **Automated Testing** | Penulisan 3 suite pengujian otomatis berbasis **Vitest** (`transaction.test.ts`, `stock.test.ts`, `product.test.ts`). |
| **Frontend UI/UX** | Pembentukan komponen POS Dashboard, katalog produk, keranjang interaktif, modal checkout, dan penerapan token warna dari `DESIGN.md`. |

---

## 3. Cara Output AI Diperiksa & Divalidasi

Untuk memastikan aspek *correctness*, *security*, kestabilan, dan kualitas kode:

1. **Static Analysis & Type Checking**: Menjalankan TypeScript compiler (`tsc --noEmit`) dan Linter (`eslint`) untuk memastikan tidak ada type mismatch atau syntax error.
2. **Automated Testing**: Menjalankan seluruh test suite Vitest (`npx vitest run`) untuk menguji logika kalkulasi harga, integritas transaksi server-side, dan validasi stok secara otomatis.
3. **Manual Functional Testing**: Menguji alur POS secara langsung melalui browser (tambah produk, ubah stok, simulasi stok habis, transaksi checkout, dan pencetakan/ekspor riwayat).
4. **Code Review & Audit**: Memeriksa manual kode buatan AI untuk memastikan tidak ada *hardcoded secrets*, credential, atau celah *security* (seperti manipulasi harga dari client-side).

---

## 4. Perubahan & Penyesuaian Terhadap Output AI

- **Penyelarasan Design System**: Mengubah default style komponen AI agar persis mengikuti token warna `#FF4500` dan font `Inter` & `JetBrains Mono` yang ditentukan di `DESIGN.md`.
- **Penguatan Error Handling**: Menambahkan kustomisasi pesan error pada schema Zod agar user-friendly saat terjadi kesalahan stok atau data kosong.
- **Refactoring Snapshot Logic**: Memastikan penamaan kolom snapshot `productName` dan `price` disimpan secara implisit saat pembuatan `TransactionItem`.
