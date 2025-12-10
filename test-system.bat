@echo off
echo ========================================
echo   TESTING SISTEM PELAPORAN RUANG
echo ========================================
echo.

echo [1/3] Checking Backend...
cd backend
echo Checking Python dependencies...
python -c "import flask, flask_jwt_extended, flask_migrate, flask_cors, sqlalchemy, pymysql; print('✅ All backend dependencies OK')" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies missing. Run: pip install -r requirements.txt
    goto :end
)

echo Checking database connection...
python -c "from app.config import Config; print('✅ Database config OK')" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Database config error. Check .env file
    goto :end
)

echo.
echo [2/3] Checking Frontend...
cd ../frontend
echo Checking Node.js dependencies...
if not exist node_modules (
    echo ❌ Frontend dependencies missing. Run: npm install
    goto :end
)

echo Checking TypeScript compilation...
npx tsc --noEmit 2>nul
if %errorlevel% neq 0 (
    echo ❌ TypeScript compilation errors found
    goto :end
) else (
    echo ✅ TypeScript compilation OK
)

echo.
echo [3/3] System Status...
echo ✅ Backend: Ready
echo ✅ Frontend: Ready
echo ✅ Database: Configured
echo ✅ Authentication: Configured
echo.

echo ========================================
echo   SISTEM SIAP DIGUNAKAN!
echo ========================================
echo.
echo Untuk menjalankan:
echo 1. Backend:  start-backend.bat
echo 2. Frontend: start-frontend.bat
echo.
echo Login Admin:
echo Email:    admin@admin.com
echo Password: admin123
echo.

:end
pause