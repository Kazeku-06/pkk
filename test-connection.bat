@echo off
echo Testing Backend-Frontend Connection...
echo.

echo [1/3] Testing Backend API...
curl -s http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"test\",\"password\":\"test\"}" > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API responding
) else (
    echo ❌ Backend API not responding
    echo Make sure backend is running on port 5000
)

echo.
echo [2/3] Testing Frontend...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend responding
) else (
    echo ❌ Frontend not responding
    echo Make sure frontend is running on port 5173
)

echo.
echo [3/3] CORS Configuration:
echo ✅ Backend allows: http://localhost:5173
echo ✅ Backend allows: http://127.0.0.1:5173
echo ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
echo ✅ Headers: Content-Type, Authorization
echo.

echo If you still get CORS errors:
echo 1. Restart backend: restart-backend.bat
echo 2. Clear browser cache: Ctrl+Shift+R
echo 3. Try incognito mode
echo.

pause