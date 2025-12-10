@echo off
echo ========================================
echo   DEBUG 500 ERROR - DETAILED LOGGING
echo ========================================
echo.

echo Step 1: Kill backend processes...
taskkill /f /im python.exe 2>nul
timeout /t 3 /nobreak >nul

echo Step 2: Starting backend with detailed debug...
start "Backend-500-Debug" cmd /k "echo Backend starting with 500 error debug... && python run.py"

echo.
echo Step 3: Wait for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   DETAILED DEBUG MESSAGES TO MONITOR
echo ========================================
echo.
echo In backend console, look for these step-by-step messages:
echo.
echo For GET /admin/users:
echo ✅ 🔍 GET USERS - Starting...
echo ✅ ✅ JWT verification passed
echo ✅ 🔍 GET USERS - JWT Debug - User ID: 1
echo ✅ ✅ Current user query successful
echo ✅ 🔍 Current User: Administrator - Role: admin
echo ✅ 🔍 Found X siswa users
echo ✅ ✅ Users list created
echo.
echo For POST /admin/users:
echo ✅ 🔍 CREATE USER - Starting...
echo ✅ ✅ JWT verification passed
echo ✅ 🔍 CREATE USER - JWT Debug - User ID: 1
echo ✅ ✅ Database query successful
echo ✅ 🔍 Current User: Administrator - Role: admin
echo ✅ 🔍 Create user data: {...}
echo ✅ ✅ User object created
echo ✅ ✅ User saved to database: Test User
echo ✅ ✅ User dict created
echo.
echo If you see ❌ errors, that's where the 500 error occurs!
echo.

echo Step 4: Now test in browser:
echo 1. Go to http://localhost:5173
echo 2. Login with admin@admin.com / admin123
echo 3. Try to access admin dashboard
echo 4. Watch backend console for detailed debug messages
echo 5. Note exactly where the ❌ error occurs
echo.

pause