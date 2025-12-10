@echo off
echo ========================================
echo   RESTART BACKEND AND TEST AUTH
echo ========================================
echo.

echo Step 1: Killing backend processes...
taskkill /f /im python.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Starting backend with debug...
start "Backend-Debug" cmd /k "echo Backend starting with debug... && python run.py"

echo Step 3: Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo Step 4: Testing authentication flow...
python test-auth-flow.py

echo.
echo ========================================
echo   CHECK BACKEND CONSOLE
echo ========================================
echo.
echo Look for these messages in backend console:
echo ✅ Database tables created
echo ✅ Admin user created: admin@admin.com / admin123
echo 🔍 Login attempt: admin@admin.com
echo 🔍 User found: Administrator
echo ✅ Login successful for Administrator - Token created
echo 🔍 JWT Debug - User ID: 1
echo 🔍 Current User: Administrator - Role: admin
echo ✅ User: Administrator - Role: admin - Is Admin: True
echo.

pause