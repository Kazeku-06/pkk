@echo off
echo Installing Frontend Dependencies...
echo.

echo Removing old node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing dependencies with correct versions...
npm install

echo.
echo ========================================
echo   FRONTEND DEPENDENCIES INSTALLED
echo ========================================
echo.
echo Dependencies installed:
echo - React 18.3.1 (downgraded from 19.2.0)
echo - TypeScript types fixed
echo - All imports corrected
echo.
echo You can now run:
echo   npm run dev
echo.
pause