@echo off
echo Restarting Frontend Development Server...
echo.

echo Stopping any running processes...
taskkill /f /im node.exe 2>nul

echo Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo Clearing browser cache recommendation...
echo Please clear your browser cache (Ctrl+Shift+R) or open incognito mode

echo.
echo Starting fresh development server...
npm run dev

pause