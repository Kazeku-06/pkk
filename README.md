# Sistem Pelaporan Penggunaan Ruang Produktif

Sistem pelaporan penggunaan ruang produktif (laboratorium/bengkel) yang digunakan oleh siswa (ketua & wakil kelas) dengan validasi admin.

## 🚀 Teknologi

### Backend
- Python 3.10+ dengan Flask
- Flask-JWT-Extended untuk authentication
- Flask-Migrate untuk database migration
- SQLAlchemy ORM
- MySQL database
- File upload handling

### Frontend
- React 18+ dengan TypeScript
- Vite sebagai build tool
- TailwindCSS + DaisyUI untuk styling
- React Router untuk routing
- React Query untuk state management
- Axios untuk HTTP client
- React Hook Form untuk form handling

## 📋 Fitur

### Admin
- ✅ Mengelola user siswa (ketua & wakil kelas)
- ✅ Mengelola data ruang (lab/bengkel)
- ✅ Mengelola fasilitas per ruang
- ✅ Memvalidasi laporan yang dikirim siswa
- ✅ Melihat riwayat laporan lengkap dengan filtering

### Siswa
- ✅ Login menggunakan akun perwakilan kelas
- ✅ Mengirim laporan setelah menggunakan ruang
- ✅ Upload foto kegiatan
- ✅ Upload foto pengembalian kunci (jika ruang memakai kunci)
- ✅ Input jumlah jam pelajaran digunakan
- ✅ Input daftar fasilitas/alat yang digunakan
- ✅ Input keterangan
- ✅ Melihat riwayat laporan pribadi

## 🗄️ Database Schema

### Table: users
- id (INT PK AI)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- role (ENUM: 'admin', 'siswa')
- kelas (VARCHAR - nullable for admin)
- created_at, updated_at (TIMESTAMP)

### Table: ruang
- id (INT PK AI)
- nama_ruang (VARCHAR)
- jenis (ENUM: 'lab', 'bengkel')
- menggunakan_kunci (BOOLEAN)
- created_at (TIMESTAMP)

### Table: fasilitas
- id (INT PK AI)
- ruang_id (INT FK)
- nama_fasilitas (VARCHAR)

### Table: laporan
- id (INT PK AI)
- user_id (INT FK)
- ruang_id (INT FK)
- foto_kegiatan (VARCHAR)
- foto_kunci (VARCHAR - nullable)
- jam_pelajaran (INT)
- fasilitas_digunakan (JSON)
- keterangan (TEXT)
- status (ENUM: 'pending', 'disetujui', 'ditolak')
- alasan_penolakan (TEXT - nullable)
- created_at (TIMESTAMP)

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL (Laragon)
- Git

### 1. Setup Database
1. Buka Laragon dan start MySQL
2. Buat database baru: `pelaporan_ruang_db`

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Create admin user
flask init-db

# Run backend server
python app/main.py
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔑 Default Login

### Admin
- Email: `admin@admin.com`
- Password: `admin123`

### Siswa
Buat melalui admin panel setelah login sebagai admin.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user

### Admin - User Management
- `POST /api/admin/users` - Create user siswa
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Admin - Ruang Management
- `POST /api/admin/ruang` - Create ruang
- `GET /api/admin/ruang` - Get all ruang
- `PUT /api/admin/ruang/{id}` - Update ruang
- `DELETE /api/admin/ruang/{id}` - Delete ruang

### Admin - Fasilitas Management
- `POST /api/admin/fasilitas` - Create fasilitas
- `GET /api/admin/fasilitas?ruang_id=1` - Get fasilitas by ruang
- `DELETE /api/admin/fasilitas/{id}` - Delete fasilitas

### Siswa - Laporan
- `POST /api/laporan` - Create laporan (multipart form)
- `GET /api/laporan/me` - Get my laporan

### Admin - Laporan Validation
- `GET /api/admin/laporan` - Get pending laporan
- `GET /api/admin/laporan/{id}` - Get laporan detail
- `PUT /api/admin/laporan/{id}/approve` - Approve laporan
- `PUT /api/admin/laporan/{id}/reject` - Reject laporan

### Admin - Laporan History
- `GET /api/admin/laporan/history` - Get laporan history with filters

## 📁 Struktur Folder

```
project/
├── backend/
│   ├── app/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── ruang/         # Ruang management
│   │   ├── fasilitas/     # Fasilitas management
│   │   ├── laporan/       # Laporan module
│   │   ├── models/        # Database models
│   │   ├── config.py      # App configuration
│   │   └── main.py        # Main application
│   ├── migrations/        # Database migrations
│   ├── storage/uploads/   # File uploads
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/           # API services
    │   ├── components/    # Reusable components
    │   ├── hooks/         # Custom hooks
    │   ├── pages/         # Page components
    │   ├── routes/        # Router configuration
    │   └── types/         # TypeScript types
    └── package.json
```

## 🔄 Alur Sistem

### Alur Siswa
1. Siswa login dengan akun yang dibuat admin
2. Siswa membuka halaman "Buat Laporan"
3. Upload foto kegiatan
4. Jika ruang memakai kunci → upload foto kunci
5. Isi jam pelajaran dan pilih fasilitas yang digunakan
6. Submit laporan → status otomatis "pending"
7. Siswa dapat melihat riwayat laporannya sendiri

### Alur Admin
1. Admin login
2. Admin mendaftarkan akun ketua & wakil kelas
3. Admin menambahkan data ruang + fasilitas
4. Admin melihat laporan pending
5. Admin membuka detail laporan
6. Admin set status: disetujui/ditolak + alasan
7. Laporan masuk ke riwayat
8. Admin dapat memfilter riwayat sesuai kebutuhan

## 🎨 UI/UX Features

- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme support (DaisyUI)
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation
- ✅ Image preview
- ✅ Modal dialogs
- ✅ Toast notifications
- ✅ Filtering & search

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing (Werkzeug)
- ✅ Role-based access control
- ✅ File upload validation
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ CORS configuration

## 📱 Responsive Design

Sistem ini didesain mobile-first dan fully responsive:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1280px+)

## 🚀 Production Deployment

### Backend
1. Setup production database
2. Update environment variables
3. Run migrations
4. Setup reverse proxy (Nginx)
5. Use WSGI server (Gunicorn)

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure API base URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Backend Developer: Flask + MySQL
- Frontend Developer: React + TypeScript
- UI/UX Designer: TailwindCSS + DaisyUI

---

**Sistem Pelaporan Ruang Produktif** - Memudahkan pelaporan dan monitoring penggunaan ruang laboratorium dan bengkel di sekolah.