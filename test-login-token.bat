@echo off
echo Testing Login and JWT Token...
echo.

echo [1] Testing login endpoint:
echo.
curl -v -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" ^
  http://localhost:5000/api/auth/login

echo.
echo ========================================
echo.

echo [2] If login successful, copy the access_token
echo [3] Then test users endpoint manually:
echo.
echo curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/admin/users
echo.

echo [4] Check backend console for debug messages:
echo ✅ JWT Debug - User ID: should show number
echo ✅ Current User: should show Administrator - Role: admin
echo ✅ User: Administrator - Role: admin - Is Admin: True
echo.

pause