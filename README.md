# Mangan Rek! - Malang Culinary Heritage 

**Mangan Rek!** adalah platform direktori kuliner modern yang dirancang khusus untuk menjelajahi, merencanakan perjalanan kuliner, serta mengelola promosi kuliner bersejarah di Kota Malang. Aplikasi ini dibangun dengan performa tinggi menggunakan Next.js App Router dan teknologi web modern lainnya.

---

## 🚀 Fitur Utama

### 1. 🧑‍💻 Sisi Pengguna (User / Wisatawan)
* **Jelajahi Kuliner:** Peta kuliner Malang terintegrasi menggunakan **Leaflet Maps** untuk mempermudah pencarian lokasi kuliner.
* **Informasi Restoran:** Informasi detail mengenai menu khas, jam buka, harga, dan rating restoran kuliner di Malang.
* **Rencana Perjalanan (Itinerary Planner):** Menyusun rencana kunjungan kuliner terorganisir di Malang.
* **Promo & Voucher:** Kumpulan potongan harga, diskon khusus, dan voucher hemat dari restoran terdaftar.
* **Daftar Favorit:** Menyimpan restoran-restoran impian untuk dikunjungi nanti.
* **Formulir Kontak Interaktif:** Menghubungi admin dengan feedback yang langsung tersimpan secara aman di sistem.

### 2. 🏢 Sisi Pemilik Restoran (Admin Resto)
* **Overview Dashboard:** Melihat ringkasan penjualan, transaksi terakhir, dan status kasir.
* **Manajemen Menu:** Menambahkan, memperbarui, atau menghapus item menu beserta harga dan deskripsi.
* **Manajemen Promo & Voucher:** Membuat penawaran menarik khusus untuk menarik minat pelanggan.
* **Manajemen Kasir:** Membuat akun akses kasir untuk mengelola transaksi di tempat.
* **Laporan Penjualan & Riwayat:** Melihat grafik laporan laba kotor, item terlaris, serta riwayat transaksi lengkap.

### 3. 👥 Sisi Kasir (Cashier Dashboard)
* **Pencatatan Transaksi:** Mencatat pesanan dari pelanggan secara cepat dan akurat.
* **Riwayat Kasir:** Memantau transaksi yang diproses selama giliran kerja aktif.

### 4. 🔑 Sisi Administrator Sistem (Admin Web)
* **Manajemen Persetujuan (Approvals):** Memvalidasi registrasi restoran baru sebelum ditayangkan ke publik.
* **Manajemen Pengguna & Pemilik:** Memantau seluruh akun User dan Resto Owner yang aktif di sistem.
* **Pesan Masuk (Messages):** Membaca pesan masuk dari form kontak pelanggan dan menandai status tindak lanjut pesan tersebut.

---

## 🛠️ Stack Teknologi

Proyek ini dibangun menggunakan teknologi modern berikut:

* **Framework Utama:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
* **Gaya & Desain:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
* **Peta Interaktif:** [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
* **Koleksi Ikon:** [Lucide React](https://lucide.dev/)
* **Animasi:** [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
* **Bahasa:** TypeScript

---

## ⚙️ Cara Menjalankan Project Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal Anda:

### 1. Clone Repositori & Instal Dependensi
Pastikan Anda sudah menginstal **Node.js** di perangkat Anda, kemudian jalankan perintah berikut:
```bash
# Masuk ke direktori projek
cd mangan_rek

# Instal seluruh package dependensi
npm install
```

### 2. Jalankan Mode Development
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Setelah berjalan, buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi.

### 3. Membangun untuk Produksi (Build)
Untuk memvalidasi kesiapan deploy ke server produksi:
```bash
npm run build
```
Lalu jalankan bundle produksi dengan:
```bash
npm run start
```

---

## 📂 Struktur Folder Utama
```text
mangan_rek/
├── app/                  # Route utama menggunakan Next.js App Router
│   ├── about/            # Halaman Tentang Kami (About Us)
│   ├── api/              # API Routes Next.js
│   ├── contact/          # Halaman Hubungi Kami (Contact Form)
│   ├── dashboard/        # Dashboard Admin Web, Admin Resto, dan Kasir
│   ├── favorit/          # Halaman Restoran Favorit Pengguna
│   ├── login/            # Halaman Masuk Akun
│   ├── logout/           # Proses Keluar Akun (Logout)
│   ├── pending-approval/ # Halaman Menunggu Persetujuan Admin (Untuk Resto)
│   ├── privacy_policy/   # Kebijakan Privasi
│   ├── profile/          # Halaman Pengaturan Profil User
│   ├── promo/            # Halaman Promo & Voucher Aktif
│   ├── register/         # Halaman Registrasi (User & Resto)
│   ├── rencana-perjalanan/ # Fitur Perencana Itinerary (Itinerary Planner)
│   ├── restaurants/      # Halaman Daftar dan Detail Restoran
│   └── terms_of_service/ # Syarat dan Ketentuan
├── components/           # Komponen UI Reusable (Navbar, Button, Card, dll.)
├── lib/                  # Fungsi Helper, Auth Utlity, dan konfigurasi API
├── public/               # Asset statik (Logo, Doodle, Gambar Restoran)
└── package.json          # File konfigurasi dependensi & npm scripts
```

---
*Dibuat dengan sungguh-sungguh untuk melestarikan Warisan Kuliner Khas Kota Malang.*
