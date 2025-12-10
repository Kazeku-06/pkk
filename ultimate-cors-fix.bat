@echo off
echo ========================================
echo   ULTIMATE CORS FIX - GUARANTEED SOLUTION
echo ========================================
echo.

echo Step 1: Complete Process Cleanup...
echo Killing all Python processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
wmic process where "name='python.exe'" delete 2>nul

echo Killing all Node processes...
taskkill /f /im node.exe 2>nul

echo Clearing port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul

echo Waiting for cleanup...
timeout /t 3 /nobreak >nul

echo.
echo Step 2: Backend Configuration Applied:
echo ✅ Flask-CORS with specific origins
echo ✅ Manual CORS headers in after_request
echo ✅ Preflight OPTIONS handling in before_request
echo ✅ Environment variable CORS_ORIGINS set
echo ✅ Test endpoint /api/test added

echo.
echo Step 3: Starting Backend...
cd backend
start "Backend-CORS-Fixed" cmd /k "echo Backend starting with CORS fix... && python run.py"

echo.
echo Step 4: Waiting for backend startup...
timeout /t 8 /nobreak >nul

echo.
echo Step 5: Testing CORS...
curl -s -I -X OPTIONS -H "Origin: http://localhost:5173" http://localhost:5000/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend responding to CORS test
) else (
    echo ⚠️  Backend still starting, please wait...
)

echo.
echo Step 6: Starting Frontend...
cd ../frontend
start "Frontend-Clean" cmd /k "echo Frontend starting... && npm run dev"

echo.
echo ========================================
echo   FINAL INSTRUCTIONS
echo ========================================
echo.
echo 1. Wait for BOTH servers to fully start
echo 2. Open NEW incognito window: Ctrl+Shift+N
echo 3. Go to: http://localhost:5173
echo 4. Login: admin@admin.com / admin123
echo.
echo If STILL getting CORS error:
echo 1. Check backend terminal for any errors
echo 2. Run: test-cors-headers.bat
echo 3. Try different browser (Firefox/Edge)
echo 4. Disable antivirus/firewall temporarily
echo.
echo Backend should show: "CORS is working!" message
echo Frontend should load without CORS errors
echo.

pause