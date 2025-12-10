@echo off
echo ========================================
echo   SISTEM PELAPORAN RUANG PRODUKTIF
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
echo.

echo [2/4] Setting up Frontend...
cd ../frontend
echo Installing Node.js dependencies...
npm install
echo.

echo [3/4] Database Setup Instructions:
echo 1. Buka Laragon dan start MySQL
echo 2. Buat database: pelaporan_ruang_db
echo 3. Update file backend/.env jika perlu
echo.

echo [4/4] Setup Complete!
echo.
echo ========================================
echo   CARA MENJALANKAN APLIKASI
echo ========================================
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   python run.py
echo.
echo Frontend (Terminal 2):
echo   cd frontend  
echo   npm run dev
echo.
echo ========================================
echo   AKSES APLIKASI
echo ========================================
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:5173
echo.
echo Login Admin:
echo Email:    admin@admin.com
echo Password: admin123
echo.
echo ========================================
pause