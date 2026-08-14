# 🛍️ Ecomeers — MEVN Stack E-Commerce App

Aplikasi e-commerce full-stack yang dibangun dengan **MongoDB, Express, Vue 3, dan Node.js (MEVN)**, dilengkapi autentikasi JWT, manajemen produk berbasis role, keranjang belanja, alamat pengiriman tersimpan, dan checkout dengan integrasi pembayaran **Midtrans Snap**. Frontend juga sudah disiapkan untuk di-build ke Android lewat Capacitor.

---

## ✨ Fitur

- 🔐 **Autentikasi** — register, login, logout dengan JWT (access token + refresh token via httpOnly cookie)
- 👥 **Role-based access** — user biasa vs admin
- 📦 **Manajemen produk** — CRUD produk lengkap dengan upload gambar (admin only)
- 🛒 **Keranjang belanja** — tambah, ubah jumlah (qty), hapus item
- 📍 **Alamat tersimpan** — kelola banyak alamat pengiriman per akun, tandai alamat utama
- 💳 **Checkout & Pembayaran** — alur checkout mirip Shopee/Tokopedia (pilih alamat → ringkasan pesanan → bayar), terintegrasi **Midtrans Snap (Sandbox)**
- 📜 **Riwayat pesanan** — lihat status pesanan, cek status pembayaran manual, batalkan pesanan yang belum dibayar
- 📉 **Stok otomatis berkurang** saat pembayaran berhasil dikonfirmasi
- 📱 **Android-ready** — dikonfigurasi dengan Capacitor untuk build APK

---

## 🧱 Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) untuk autentikasi
- `bcrypt` untuk hashing password
- `multer` untuk upload gambar produk
- `midtrans-client` untuk integrasi pembayaran

**Frontend**
- Vue 3 (`<script setup>`) + TypeScript
- Vite
- Pinia + `pinia-plugin-persistedstate`
- Vue Router
- Bootstrap 5
- Axios
- Capacitor (build Android)

---

## 📁 Struktur Folder

```
ecomeers_mevn/
├── backend/
│   ├── config/
│   │   ├── database.js        # Koneksi MongoDB
│   │   ├── cors.js             # Whitelist origin
│   │   └── midtrans.js         # Snap & Core API client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productControler.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── addressController.js
│   ├── middleware/
│   │   ├── authentication.js   # Verifikasi JWT
│   │   ├── auth.js             # Guard: wajib login
│   │   ├── credentials.js
│   │   ├── upload.js           # Konfigurasi Multer
│   │   └── error_handler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Address.js
│   ├── routes/api/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   └── address.js
│   └── index.js                # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/         # NavbarUser, ProductCard, AddressFormModal, dll.
    │   ├── composables/
    │   │   └── useApi.ts       # Axios instance public & private (auto-refresh token)
    │   ├── router/
    │   │   └── index.ts        # Routing + navigation guard
    │   ├── stores/              # Pinia stores: auth, product, cart, order, address
    │   ├── views/
    │   │   ├── auth/            # Login, Register
    │   │   ├── admin/           # Manajemen produk (admin)
    │   │   ├── HomeView.vue
    │   │   ├── ProductDetail.vue
    │   │   ├── CartView.vue
    │   │   ├── CheckoutView.vue
    │   │   ├── OrderHistoryView.vue
    │   │   └── AddressListView.vue
    │   └── main.ts
    ├── index.html
    └── android/                 # Hasil generate Capacitor
```

---

## ✅ Prasyarat

- [Node.js](https://nodejs.org/) `v20.19+` atau `v22.12+`
- [MongoDB](https://www.mongodb.com/) (lokal via MongoDB Community Server, atau cloud via MongoDB Atlas)
- Akun [Midtrans Sandbox](https://dashboard.midtrans.com/register) (gratis) untuk fitur pembayaran

---

## 🚀 Instalasi & Setup

### 1. Clone repository

```bash
git clone <url-repo-ini>
cd ecomeers_mevn
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` dengan isi:

```env
PORT=3500
DATABASE_URI=mongodb://127.0.0.1:27017/ecomeers   # atau connection string MongoDB Atlas
ACCESS_TOKEN_SECRET=<random-secret-string>
REFRESH_TOKEN_SECRET=<random-secret-string>

MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

> Ambil `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` dari **Midtrans Dashboard → Settings → Access Keys** (pastikan mode di **Sandbox**, bukan Production).

Jalankan server:

```bash
npm run start
# atau untuk auto-reload saat development:
npx nodemon index.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env` di folder `frontend/` dengan isi:

```env
VITE_API_URL="http://localhost:3500"
VITE_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx"
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

---

## 🧪 Testing Pembayaran (Sandbox)

Saat checkout, popup Midtrans Snap akan muncul. Gunakan kartu simulasi berikut untuk metode **kartu kredit**:

| Field | Nilai |
|---|---|
| Nomor Kartu | `4811 1111 1111 1114` |
| CVV | `123` |
| Expiry | tanggal bebas di masa depan, misal `01/27` |
| OTP (jika diminta) | `112233` |

Metode lain (GoPay, QRIS, dll.) di sandbox biasanya punya tombol simulasi "Bayar" langsung di popup, tanpa OTP.

> Status pembayaran diverifikasi langsung ke Midtrans lewat endpoint `POST /api/orders/:orderId/verify` (dipanggil otomatis setelah popup sukses/pending), jadi tidak perlu setup webhook publik/ngrok untuk development lokal.

---

## 📡 API Endpoints

**Auth** (`/api/auth`)
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/register` | Registrasi user baru |
| POST | `/login` | Login, dapat access token |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Logout |

**Produk** (`/api/products`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | List semua produk |
| GET | `/:id` | Detail produk |
| POST | `/` | Tambah produk (admin) |
| PATCH | `/:id` | Update produk (admin) |
| DELETE | `/:id` | Hapus produk (admin) |

**Cart** (`/api/cart`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/:userId` | Lihat isi cart |
| POST | `/:userId` | Tambah produk ke cart |
| PATCH | `/:userId/:productId` | Ubah jumlah (qty) |
| DELETE | `/:userId/:productId` | Hapus item dari cart |

**Alamat** (`/api/addresses`) — semua wajib login
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | List alamat milik user |
| POST | `/` | Tambah alamat baru |
| PATCH | `/:id` | Update alamat |
| DELETE | `/:id` | Hapus alamat |
| PATCH | `/:id/default` | Jadikan alamat utama |

**Order** (`/api/orders`) — wajib login (kecuali webhook)
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/` | Checkout — buat order dari cart + generate Snap token |
| GET | `/mine` | Riwayat pesanan milik user |
| GET | `/:orderId` | Detail satu pesanan |
| POST | `/:orderId/verify` | Cek & sinkronkan status pembayaran ke Midtrans |
| POST | `/:orderId/cancel` | Batalkan pesanan (hanya status `pending`) |
| POST | `/notification` | Webhook resmi dari server Midtrans (public) |

---

## ⚠️ Keterbatasan & Rencana Pengembangan

- Ongkos kirim belum dihitung (belum ada integrasi API kurir/RajaOngkir) — total checkout murni subtotal barang
- Reservasi stok saat status pesanan masih `pending` belum diimplementasikan, jadi ada kemungkinan kecil race condition kalau dua user checkout barang yang sama dan stoknya cuma cukup untuk satu
- Migrasi frontend dari Vue.js ke Next.js sedang direncanakan (lihat `TODO.md`)

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran/pengembangan pribadi.