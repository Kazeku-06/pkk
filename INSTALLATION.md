# 📋 Panduan Instalasi Lengkap

## Sistem Pelaporan Penggunaan Ruang Produktif

### 🔧 Prerequisites

Pastikan Anda sudah menginstall:

1. **Python 3.10+** 
   - Download dari: https://www.python.org/downloads/
   - Centang "Add Python to PATH" saat instalasi

2. **Node.js 18+**
   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)

3. **Laragon** (untuk Windows)
   - Download dari: https://laragon.org/
   - Atau gunakan XAMPP/WAMP sebagai alternatif

4. **Git** (opsional)
   - Download dari: https://git-scm.com/

---

## 🚀 Langkah Instalasi

### 1. Setup Database

1. **Buka Laragon**
   - Start Apache dan MySQL
   - Klik "Database" atau buka phpMyAdmin
   - Buat database baru dengan nama: `pelaporan_ruang_db`

### 2. Setup Project

#### Opsi A: Menggunakan Script Otomatis (Recommended)

1. **Double-click file `setup.bat`**
   - Script akan otomatis menginstall semua dependencies
   - Ikuti instruksi yang muncul di layar

#### Opsi B: Manual Setup

1. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

### 3. Konfigurasi Environment

1. **Copy file environment**
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **Edit file `.env`** (jika perlu)
   - Buka `backend/.env` dengan text editor
   - Sesuaikan konfigurasi database jika berbeda:
   ```
   DATABASE_URL=mysql+pymysql://root:@localhost/pelaporan_ruang_db
   ```

---

## 🏃‍♂️ Menjalankan Aplikasi

### Opsi A: Menggunakan Script (Recommended)

1. **Backend**: Double-click `start-backend.bat`
2. **Frontend**: Double-click `start-frontend.bat`

### Opsi B: Manual

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   python run.py
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🌐 Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 🔑 Login Default

**Admin:**
- Email: `admin@admin.com`
- Password: `admin123`

**Siswa:**
- Buat melalui admin panel setelah login sebagai admin

---

## 📁 Struktur Project

```
sistem-pelaporan-ruang/
├── backend/                 # Flask API Server
│   ├── app/                # Application modules
│   ├── storage/uploads/    # File uploads
│   ├── .env               # Environment config
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Main runner
├── frontend/              # React Frontend
│   ├── src/              # Source code
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite config
├── setup.bat             # Auto setup script
├── start-backend.bat     # Backend runner
├── start-frontend.bat    # Frontend runner
└── README.md            # Documentation
```

---

## 🔧 Troubleshooting

### ❌ Error: "pip is not recognized"
**Solusi:** Install Python dengan centang "Add Python to PATH"

### ❌ Error: "npm is not recognized"  
**Solusi:** Install Node.js dan restart command prompt

### ❌ Error: Database connection failed
**Solusi:** 
1. Pastikan MySQL di Laragon sudah running
2. Cek nama database: `pelaporan_ruang_db`
3. Cek konfigurasi di `backend/.env`

### ❌ Error: Port already in use
**Solusi:**
- Backend (5000): Tutup aplikasi lain yang menggunakan port 5000
- Frontend (5173): Tutup browser tab lama atau restart Vite

### ❌ Error: Module not found
**Solusi:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### ❌ Error: CORS issues
**Solusi:** Pastikan backend berjalan di port 5000 dan frontend di 5173

---

## 📱 Testing Aplikasi

### 1. Login sebagai Admin
1. Buka http://localhost:5173
2. Login dengan `admin@admin.com` / `admin123`
3. Anda akan masuk ke dashboard admin

### 2. Buat User Siswa
1. Klik "Manajemen User"
2. Klik "Tambah User"
3. Isi data siswa (ketua/wakil kelas)

### 3. Buat Ruang & Fasilitas
1. Klik "Manajemen Ruang" → Tambah ruang
2. Klik "Manajemen Fasilitas" → Tambah fasilitas per ruang

### 4. Test sebagai Siswa
1. Logout dari admin
2. Login dengan akun siswa yang dibuat
3. Buat laporan baru
4. Upload foto dan isi form

### 5. Validasi Laporan
1. Login kembali sebagai admin
2. Klik "Validasi Laporan"
3. Setujui/tolak laporan siswa

---

## 🎯 Fitur Utama

### Admin Panel
- ✅ Dashboard dengan statistik
- ✅ Manajemen user siswa
- ✅ Manajemen ruang (lab/bengkel)
- ✅ Manajemen fasilitas per ruang
- ✅ Validasi laporan siswa
- ✅ Riwayat laporan dengan filter

### Siswa Panel  
- ✅ Dashboard pribadi
- ✅ Form laporan dengan upload foto
- ✅ Riwayat laporan pribadi
- ✅ Status validasi real-time

### Technical Features
- ✅ JWT Authentication
- ✅ File upload handling
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Form validation
- ✅ Error handling

---

## 📞 Support

Jika mengalami masalah:

1. **Cek log error** di terminal backend/frontend
2. **Pastikan semua service running** (MySQL, Backend, Frontend)
3. **Restart aplikasi** jika perlu
4. **Cek dokumentasi** di README.md

---

## 🎉 Selamat!

Sistem Pelaporan Ruang Produktif sudah siap digunakan!

**Next Steps:**
1. Customize sesuai kebutuhan sekolah
2. Tambah data ruang dan fasilitas
3. Daftarkan akun siswa (ketua & wakil kelas)
4. Mulai gunakan sistem untuk pelaporan

---

*Sistem ini dibuat untuk memudahkan pelaporan dan monitoring penggunaan ruang laboratorium dan bengkel di sekolah.*