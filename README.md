# POS System

Aplikasi Point of Sale (POS) berbasis web modern untuk membantu pencatatan transaksi penjualan, manajemen produk, dan pengelolaan kasir secara efisien.

## Teknologi yang Digunakan

* **Backend:** Laravel
* **Frontend:** React, TypeScript, Inertia.js
* **Styling:** Tailwind CSS

## Prasyarat Sistem

Pastikan perangkat kamu sudah terinstal:
* PHP >= 8.2 & Composer
* Node.js & NPM
* Database (MySQL / PostgreSQL / SQLite)

## Cara Instalasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com
   cd pos-system
   ```

2. **Instal dependensi PHP dan JavaScript:**
   ```bash
   composer install
   npm install
   ```

3. **Setup file Environment (`.env`):**
   Salin file `.env.example` menjadi `.env` lalu buat application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Buat Database & Konfigurasi `.env`:**
   Buat database baru di database manager kamu (misal: `pos_system`), lalu sesuaikan pengaturan koneksi database di dalam file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=pos_system
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Jalankan Migration dan Seeder:**
   Perintah ini akan membuat struktur tabel sekaligus mengisi data awal (termasuk akun default):
   ```bash
   php artisan migrate --seed
   ```

## Cara Menjalankan Aplikasi

1. Jalankan server backend Laravel dan Vite frontend secara bersamaan (buka dua terminal terpisah):
   * **Terminal 1 (Backend):**
     ```bash
     php artisan serve
     ```
   * **Terminal 2 (Frontend):**
     ```bash
     npm run dev
     ```
2. Buka browser dan akses `http://127.0.0.1:8000`.

## Akun Login Default

Gunakan kredensial berikut untuk masuk ke dalam sistem setelah menjalankan seeder:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **Cashier** | `cashier@example.com` | `password` |
