@echo off
echo Testing CORS Headers...
echo.

echo [1] Testing OPTIONS preflight request:
echo.
curl -v -X OPTIONS ^
  -H "Origin: http://localhost:5173" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type" ^
  http://localhost:5000/api/auth/login

echo.
echo ========================================
echo.

echo [2] Testing actual POST request:
echo.
curl -v -X POST ^
  -H "Origin: http://localhost:5173" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" ^
  http://localhost:5000/api/auth/login

echo.
echo ========================================
echo.

echo [3] Testing CORS test endpoint:
echo.
curl -v -H "Origin: http://localhost:5173" http://localhost:5000/api/test

echo.
echo ========================================
echo Look for these headers in the response:
echo ✅ Access-Control-Allow-Origin: http://localhost:5173
echo ✅ Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS
echo ✅ Access-Control-Allow-Headers: Content-Type,Authorization
echo ✅ Access-Control-Allow-Credentials: true
echo.

pause