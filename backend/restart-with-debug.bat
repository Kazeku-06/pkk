@echo off
echo ========================================
echo   RESTART BACKEND WITH ENHANCED DEBUG
echo ========================================
echo.

echo Step 1: Kill backend processes...
taskkill /f /im python.exe 2>nul
timeout /t 3 /nobreak >nul

echo Step 2: Starting backend with enhanced JWT debug...
start "Backend-Enhanced-Debug" cmd /k "echo Backend starting with enhanced JWT debug... && python run.py"

echo.
echo Step 3: Wait for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 4: Test login...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login > login_test.json

echo Login response:
type login_test.json

echo.
echo ========================================
echo   ENHANCED DEBUG MESSAGES TO LOOK FOR
echo ========================================
echo.
echo In backend console, you should see:
echo ✅ 🔍 Login attempt: admin@admin.com
echo ✅ 🔍 User found: Administrator
echo ✅ ✅ Login successful for Administrator - Token created
echo.
echo When accessing /admin/users:
echo ✅ 🔍 JWT Debug - User ID: 1
echo ✅ 🔍 Current User: Administrator - Role: admin
echo ✅ 🔍 Found X siswa users
echo.
echo If you see errors:
echo ❌ JWT verification failed
echo ❌ Token tidak valid
echo ❌ User tidak ditemukan
echo ❌ Error traceback
echo.

echo Step 5: Now test in browser:
echo 1. Go to http://localhost:5173
echo 2. Login with admin@admin.com / admin123
echo 3. Check backend console for debug messages
echo 4. If still 422, check browser console for token
echo.

pause