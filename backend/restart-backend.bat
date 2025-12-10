@echo off
echo Restarting Backend Server with CORS Fix...
echo.

echo Stopping any running Python processes...
taskkill /f /im python.exe 2>nul

echo.
echo CORS Configuration Updated:
echo ✅ Origins: http://localhost:5173, http://127.0.0.1:5173
echo ✅ Headers: Content-Type, Authorization
echo ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
echo ✅ Credentials: Supported
echo ✅ File serving: /storage/uploads/ endpoint added
echo.

echo Starting backend server...
python run.py

pause