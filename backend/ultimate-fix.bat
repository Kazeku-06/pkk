@echo off
echo ========================================
echo   ULTIMATE FIX FOR 422 ERROR
echo ========================================
echo.

echo Step 1: Kill all backend processes...
taskkill /f /im python.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Fix database completely...
python fix-database.py
if %errorlevel% neq 0 (
    echo ❌ Database fix failed
    pause
    exit /b 1
)

echo.
echo Step 3: Start backend with fresh database...
start "Backend-Fixed" cmd /k "echo Backend starting with fixed database... && python run.py"

echo.
echo Step 4: Wait for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 5: Test JWT endpoint...
echo Testing login...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login > test_login.json

echo.
echo Login response:
type test_login.json

echo.
echo ========================================
echo   VERIFICATION STEPS
echo ========================================
echo.
echo 1. Check backend console for:
echo    ✅ Database tables created
echo    ✅ Admin user created
echo    ✅ Login successful messages
echo.
echo 2. In browser:
echo    - Clear localStorage: localStorage.clear()
echo    - Refresh page: F5
echo    - Login again: admin@admin.com / admin123
echo    - Check console for token messages
echo.
echo 3. Test JWT endpoint in browser console:
echo    fetch('/api/admin/test-jwt', {
echo      headers: {'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
echo    }).then(r =^> r.json()).then(console.log)
echo.

pause