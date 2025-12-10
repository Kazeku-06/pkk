@echo off
echo ========================================
echo   TESTING JWT DEBUG ENDPOINT
echo ========================================
echo.

echo Step 1: Get JWT token from login...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login > token_response.json

echo.
echo Step 2: Extract token (manual step)...
echo Please copy the access_token from token_response.json
type token_response.json
echo.

echo Step 3: Test JWT endpoint manually...
echo Run this command with your token:
echo.
echo curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/admin/test-jwt
echo.

echo Step 4: Or test in browser console:
echo.
echo fetch('http://localhost:5000/api/admin/test-jwt', {
echo   headers: {
echo     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
echo   }
echo }).then(r =^> r.json()).then(console.log)
echo.

echo Step 5: Check backend console for debug messages:
echo ✅ 🔍 TEST JWT - User ID: 1
echo ✅ JWT working! message
echo ❌ Any error messages with traceback
echo.

pause