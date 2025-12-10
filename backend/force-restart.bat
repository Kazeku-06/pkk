@echo off
echo Force Restarting Backend Server...
echo.

echo Killing all Python processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   CORS CONFIGURATION UPDATED
echo ========================================
echo ✅ Origins: localhost:5173, 127.0.0.1:5173
echo ✅ Headers: Content-Type, Authorization
echo ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
echo ✅ Credentials: Supported
echo ✅ Manual CORS headers: Added as backup
echo ✅ File uploads: /storage/uploads/ endpoint
echo.

echo Starting backend with new CORS config...
python run.py

pause