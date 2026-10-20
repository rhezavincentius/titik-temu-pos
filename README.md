# Titik Temu POS

Frontend demo untuk UMKM **kedai kopi & bakery**, dengan tata navigasi admin ala Filament. Ini **bukan Filament asli** dan tidak membutuhkan Laravel, PHP, database, npm, atau proses build.

## Jalankan

Buka `index.html` langsung di browser. Untuk origin penyimpanan yang konsisten, lebih baik gunakan server lokal dari folder ini:

```sh
python -m http.server 5500
```

Buka `http://localhost:5500`. Jangan jalankan server dari root Laravel karena folder tersebut berisi `.env` dan file privat lain.

## Fitur

- Kasir: pencarian, kategori, pengurutan harga/nama, keranjang, dine-in/takeaway, pelanggan, meja, dan catatan.
- Diskon opsional 10%, pajak **simulasi** 10% sesudah diskon, dan pembulatan ke rupiah penuh.
- Simulasi pembayaran tunai dengan validasi nominal/kembalian, QRIS, dan debit. **Tidak ada pembayaran nyata atau payment gateway.**
- Stok berkurang hanya setelah checkout; stok tidak dapat dipesan melebihi ketersediaan.
- Struk, cetak struk lewat browser, riwayat, filter, dan export CSV sesuai filter.
- Tambah/edit/hapus menu; transaksi lama menyimpan snapshot nama/harga dan tetap utuh jika menu diubah/dihapus.
- Dashboard: ringkasan hari ini, pendapatan tujuh hari, dan menu terlaris berdasarkan transaksi demo.
- `localStorage` menyimpan menu, stok, transaksi, dan keranjang. Reset data tersedia di sidebar, dengan konfirmasi.
- Responsif untuk desktop, tablet, dan mobile. Ilustrasi SVG lokal; tidak ada dependensi JavaScript eksternal.

Data awal berisi **riwayat contoh tujuh hari** (bukan penjualan nyata). Stok awal sudah diasumsikan sebagai stok yang tersisa setelah transaksi contoh. Shift, nama toko, dan profil pengguna adalah identitas demo, bukan sistem autentikasi atau absensi operasional.

Google Fonts opsional membutuhkan internet; jika tidak tersedia, UI otomatis memakai font sistem. Seluruh fungsi dan ilustrasi tetap bisa berjalan tanpa font eksternal.

## Upload ke GitHub Pages

**Upload hanya isi folder `pos-demo`, bukan project Laravel.**

1. Buat repository publik baru, misalnya `titik-temu-pos-demo`.
2. Upload **isi** folder ini ke root repository. `index.html`, `app.js`, dan `styles.css` harus berada di root, bukan di dalam subfolder `pos-demo`.
3. Buka **Settings → Pages → Build and deployment**.
4. Pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu **Save**.
5. Tunggu deployment selesai. Link tersedia di halaman Pages, biasanya:
   `https://USERNAME.github.io/titik-temu-pos-demo/`

Semua link aset menggunakan path relatif. Navigasi memakai hash (`#kasir`, `#dashboard`, `#produk`, `#transaksi`) sehingga refresh dan link langsung tidak membutuhkan server routing khusus.

Jika repository privat, ketersediaan GitHub Pages bergantung pada paket GitHub. Repository publik adalah pilihan paling sederhana untuk demo portfolio.

## Batasan penting

- Data hanya untuk browser/origin ini, tidak dibagikan ke pengunjung lain. Browser dapat menghapusnya. Jangan masukkan data sensitif.
- Bukan aplikasi produksi: tidak ada login, otorisasi, sinkronisasi server, stok bahan baku, refund, audit log, pencadangan, atau perlindungan race condition multi-kasir.
- Sinkronisasi antar-tab bersifat kenyamanan demo, bukan jaminan konsistensi transaksi bersamaan.
- Jika `localStorage` tidak tersedia/penuh, aplikasi memberi peringatan dan data baru hanya bertahan di memori selama halaman masih terbuka.
- Rasio pajak 10% hanya contoh UI; sesuaikan kebijakan, basis perhitungan, serta peraturan usaha saat membangun backend.

## Saat dipindahkan ke Filament asli

Project Laravel yang ada **tidak diubah**. Gunakan demo ini sebagai spesifikasi visual/alur, bukan file yang tinggal ditempel ke Filament.

| Bagian demo | Implementasi Laravel / Filament |
| --- | --- |
| Layout & sidebar | Konfigurasi Panel, navigasi, theme |
| Dashboard | Stats/chart widgets dengan query database |
| Menu & stok | Product Resource, Schema/Form dan Table |
| Kasir | Custom Page + Livewire |
| Riwayat & struk | Transaction Resource dan halaman/Blade struk |
| Penyimpanan browser | Model, migration, service, validation, authorization |
| Checkout | Transaksi database atomik + stock locking + payment integration |

Relasi data demo mengikuti konsep `Product`, kategori, `Transaction`, dan detail transaksi. Backend saat ini belum menyediakan field stok produk seperti demo; tentukan dulu apakah stok berupa produk siap jual atau dihitung dari bahan baku. Nilai status/metode pembayaran juga perlu dipetakan ke aturan backend sebenarnya.

Ilustrasi, palet warna, dan beberapa markup halaman custom bisa digunakan kembali. Form/table sebaiknya dibuat menggunakan komponen native Filament. Harga dan stok harus dihitung/diotorisasi ulang di server; jangan percaya total dari frontend.
