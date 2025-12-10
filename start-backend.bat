@echo off
echo Starting Backend Server with CORS Support...
echo.
echo CORS Configuration:
echo ✅ Frontend Origins: http://localhost:5173, http://127.0.0.1:5173
echo ✅ File Uploads: Supported
echo ✅ Authentication: JWT Ready
echo.
cd backend
python run.py
pause