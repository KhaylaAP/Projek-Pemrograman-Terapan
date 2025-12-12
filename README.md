1. Login

* Admin masuk ke halaman login.
* Input username + password.
* Jika benar → masuk ke dashboard.

2. Dashboard
* Admin melihat ringkasan: total kategori, total produk, total stok, total supplier.
* Ada quick actions:

  * Add New Product
  * Manage Inventory
  * Add Supplier
  * Add Category

MENU CATEGORY*

3. Manage Category
* Admin membuka halaman Category Management.
* Melihat daftar kategori (misal: Skinny, Regular, Slim, Cargo).

4. Add Category
* Klik “Add New Category”.
* Isi:
  * Category Name (misal: Levis, Wrangler, Nevada)
  * Description
* Klik Save → kategori tersimpan.

5. Edit Category
* Klik Edit pada kategori tertentu.
* Ubah nama atau deskripsi.
* Save.

6. Delete Category
* Klik Delete → muncul konfirmasi.
* Jika setuju → kategori terhapus (beserta produk yang terkait jika sistem mengikuti ERD tertentu).

---

MENU PRODUCT

7. Manage Product
* Admin melihat daftar produk sesuai kategori.

8. Add Product
* Klik Add Product.
* Isi:
  * Nama produk
  * Pilih kategori
  * Harga modal & harga jual
  * Variasi ukuran (S, M, L, XL)
  * Deskripsi
  * Upload gambar
* Klik Save → produk tersimpan.

9. Edit Product
* Ubah nama, kategori, harga, ukuran, gambar, dan deskripsi.
* Save.

10. Delete Product
* Klik Delete → konfirmasi → produk dihapus.

---

*MENU INVENTORY*

11. Manage Inventory*
* Admin melihat stok setiap produk per ukuran.
*12. Add Stock (Barang Masuk)*
* Pilih produk → klik Add Stock.
* Isi jumlah barang masuk.
* Pilih supplier.
* Save → stok bertambah.

13. Reduce Stock (Barang Keluar)
* Pilih produk → klik Reduce Stock.
* Isi jumlah keluar (penjualan, rusak, retur).
* Save → stok berkurang.

14. Stock History*
* Melihat riwayat mutasi stok (masuk/keluar).

MENU SUPPLIER
15. Manage Supplier
Admin melihat daftar supplier.

16. Add Supplier
* Klik Add Supplier.
* Isi:
  * Nama supplier
  * Kontak
  * Alamat
  * Catatan
* Save.

17. Edit Supplier*
* Ubah data supplier → Save.
18. Delete Supplier*
* Klik Delete → konfirmasi.

*19. Logout*
* Admin keluar dari sistem.

Cara menjalankan docker:
- buka terminal
- cd ke directory aplikasi
- jalankan "docker compose up --build" (versi docker compose plugin)
- jalankan "docker-compose up --build" (versi docker compose)
- buka browser
- masuk ke dalam link "localhost:3000"


Cara menghentikan docker:
- buka terminal yang docker berjalan dalam
- tekan tombol ctrl + c
- tunggu hingga docker berhenti
- jalankan "docker compose down -v" (versi docker compose plugin, untuk menghapus semua container dan volume)
- jalankan "docker-compose down -v" (versi docker compose, untuk menghapus semua container dan volume)
- jalankan "docker compose down" (versi docker compose plugin, untuk menghapus container tapi simpan volume)
- jalankan "docker-compose down" (versi docker compose, untuk menghapus container tapi simpan volume)