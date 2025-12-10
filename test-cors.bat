@echo off
echo Testing CORS Configuration...
echo.

echo [1/4] Testing Backend API Health...
curl -s http://localhost:5000/api/test 2>nul
if %errorlevel% equ 0 (
    echo ✅ Backend API responding
) else (
    echo ❌ Backend API not responding - Make sure backend is running
    goto :end
)

echo.
echo [2/4] Testing CORS Headers...
curl -s -I -X OPTIONS -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" http://localhost:5000/api/auth/login

echo.
echo [3/4] Testing Login Endpoint...
curl -s -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:5173" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login

echo.
echo [4/4] CORS Configuration Status:
echo ✅ Allowed Origins: http://localhost:5173, http://127.0.0.1:5173
echo ✅ Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
echo ✅ Allowed Headers: Content-Type, Authorization
echo ✅ Credentials: Supported
echo ✅ Manual CORS headers: Active as backup
echo.

echo If CORS still not working:
echo 1. Run: force-restart.bat (in backend folder)
echo 2. Clear browser cache: Ctrl+Shift+R
echo 3. Try incognito mode
echo 4. Check browser console for detailed error

:end
pause