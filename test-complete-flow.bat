@echo off
echo ========================================
echo   TESTING COMPLETE AUTHENTICATION FLOW
echo ========================================
echo.

echo Step 1: Check if backend is running...
curl -s http://localhost:5000/api/test >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend not running. Starting backend...
    cd backend
    start "Backend" cmd /k "python run.py"
    cd ..
    echo Waiting for backend to start...
    timeout /t 10 /nobreak >nul
) else (
    echo ✅ Backend is running
)

echo.
echo Step 2: Testing login endpoint...
curl -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login > login_response.txt 2>&1

echo Response saved to login_response.txt
type login_response.txt

echo.
echo Step 3: Check frontend localStorage...
echo Open browser console and run:
echo   localStorage.getItem('access_token')
echo   localStorage.getItem('user')

echo.
echo Step 4: Manual test steps:
echo 1. Open http://localhost:5173
echo 2. Open browser DevTools (F12)
echo 3. Go to Console tab
echo 4. Login with admin@admin.com / admin123
echo 5. Check console for debug messages:
echo    - "🔍 Login - Saving token and user data"
echo    - "🔍 API Request: /admin/users Token: ..."
echo 6. Go to Application tab → Local Storage
echo 7. Check if access_token and user are saved

echo.
echo Step 5: Backend console should show:
echo    - "🔍 Login attempt: admin@admin.com"
echo    - "✅ Login successful for Administrator"
echo    - "🔍 JWT Debug - User ID: 1"
echo    - "✅ User: Administrator - Role: admin - Is Admin: True"

echo.
pause