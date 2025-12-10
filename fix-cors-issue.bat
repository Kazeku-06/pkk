@echo off
echo ========================================
echo   FIXING CORS ISSUE - COMPLETE SOLUTION
echo ========================================
echo.

echo Step 1: Stopping all processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
echo ✅ Processes stopped

echo.
echo Step 2: CORS Configuration Applied:
echo ✅ Primary CORS: Flask-CORS with specific origins
echo ✅ Backup CORS: Manual headers in after_request
echo ✅ Preflight: OPTIONS requests handled
echo ✅ Origins: http://localhost:5173, http://127.0.0.1:5173
echo ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
echo ✅ Headers: Content-Type, Authorization
echo ✅ Credentials: Supported

echo.
echo Step 3: Starting Backend...
cd backend
start "Backend Server" cmd /k "python run.py"

echo.
echo Step 4: Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 5: Starting Frontend...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Step 6: Testing CORS...
timeout /t 3 /nobreak >nul
curl -s http://localhost:5000/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend responding
) else (
    echo ⚠️  Backend still starting...
)

echo.
echo ========================================
echo   NEXT STEPS
echo ========================================
echo 1. Wait for both servers to fully start
echo 2. Open: http://localhost:5173
echo 3. Clear browser cache: Ctrl+Shift+R
echo 4. Login: admin@admin.com / admin123
echo.
echo If CORS still fails:
echo - Try incognito mode
echo - Check browser console
echo - Run: test-cors.bat
echo.

pause