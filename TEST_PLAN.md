# Test Plan - Mini Point of Sale (POS)

## 1. Testing Strategy & Objectives

Dokumen ini mendefinisikan strategi dan spesifikasi pengujian otomatis (*automated testing*) untuk memastikan keandalan, keakuratan kalkulasi harga, serta integritas stok pada aplikasi Mini POS.

Sesuai dengan requirement recruitment technical test, aplikasi **wajib memiliki minimal 3 automated tests** yang menguji bagian penting aplikasi.

---

## 2. Test Suite Specifications

### 🧪 Test Suite 1: Server-Side Price Calculation & Snapshotting
- **File Target**: `tests/transaction.test.ts`
- **Fokus Pengujian**: Unit test kalkulasi total transaksi & independensi harga snapshot.
- **Kasus Uji**:
  - `TC-01`: Menghitung subtotal per item (`price * quantity`) dan total bayar secara tepat di server-side.
  - `TC-02`: Memastikan `TransactionItem` menyimpan snapshot harga saat checkout. Jika harga `Product` asli diubah di kemudian hari, transaksi lama tidak mengalami perubahan total.

### 🧪 Test Suite 2: Stock Availability & Negative Stock Prevention
- **File Target**: `tests/stock.test.ts`
- **Fokus Pengujian**: Integration test pengurangan stok & pencegahan stok negatif.
- **Kasus Uji**:
  - `TC-03`: Mengurangi stok produk secara tepat sesuai jumlah item yang dibeli setelah checkout berhasil.
  - `TC-04`: Menolak checkout dan melemparkan error jika jumlah pembelian melebihi stok yang tersedia (`quantity > stock`).
  - `TC-05`: Memastikan stok produk tidak pernah bernilai negatif dalam situasi apapun.

### 🧪 Test Suite 3: Product Active/Inactive Status Validation
- **File Target**: `tests/product.test.ts`
- **Fokus Pengujian**: Validasi status produk saat transaksi & pengelolaan produk.
- **Kasus Uji**:
  - `TC-06`: Memastikan produk dengan status `isActive: false` ditolak oleh backend saat diajukan dalam transaksi checkout.
  - `TC-07`: Memastikan toggle status produk (aktif <-> nonaktif) memperbarui status di database secara konsisten.

---

## 3. Test Runner & Configuration

Pengujian menggunakan **Vitest** karena kecepatannya, dukungan native TypeScript, dan integrasi seamless dengan Next.js.

### Perintah Pengujian:
```bash
# Menjalankan seluruh test suite
npx vitest run

# Menjalankan vitest dalam mode watch (interaktif saat development)
npx vitest
```

---

## 4. Expected Output & Verification Criteria

Semua pengujian harus menghasilkan status **PASS 100%** tanpa error sebelum aplikasi di-deploy ke produksi. Hasil eksekusi test akan dicantumkan dalam lampiran Dokumentasi Submission PDF.
