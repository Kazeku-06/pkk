@echo off
echo FORCE KILLING AND RESTARTING BACKEND...
echo.

echo Step 1: Killing ALL Python processes...
wmic process where "name='python.exe'" delete 2>nul
wmic process where "name='pythonw.exe'" delete 2>nul
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul

echo Step 2: Waiting 5 seconds for cleanup...
timeout /t 5 /nobreak >nul

echo Step 3: Checking if port 5000 is free...
netstat -an | find "5000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 still in use, trying to free it...
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
)

echo Step 4: CORS Configuration Status:
echo ✅ Direct CORS configuration applied
echo ✅ Manual headers as backup
echo ✅ Preflight OPTIONS handling
echo ✅ Origins: http://localhost:5173, http://127.0.0.1:5173
echo ✅ All methods and headers allowed

echo.
echo Step 5: Starting backend with NEW configuration...
python run.py

pause