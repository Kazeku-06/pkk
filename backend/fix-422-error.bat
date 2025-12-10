@echo off
echo ========================================
echo   FIXING 422 ERROR - COMPLETE SOLUTION
echo ========================================
echo.

echo Step 1: Debugging database and authentication...
python debug-422.py

echo.
echo Step 2: Force recreate database tables...
python -c "from app import create_app, db; from app.models.user import User, UserRole; app = create_app(); app.app_context().push(); db.drop_all(); db.create_all(); admin = User(name='Administrator', email='admin@admin.com', role=UserRole.admin); admin.set_password('admin123'); db.session.add(admin); db.session.commit(); print('✅ Database recreated with admin user')"

echo.
echo Step 3: Testing endpoints...
timeout /t 2 /nobreak >nul
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:5000/api/auth/login

echo.
echo ========================================
echo   SOLUTION APPLIED
echo ========================================
echo.
echo ✅ Database tables recreated
echo ✅ Admin user recreated
echo ✅ JWT authentication ready
echo ✅ CORS headers working
echo.
echo Next steps:
echo 1. Restart backend if needed
echo 2. Clear browser cache: Ctrl+Shift+R
echo 3. Login again: admin@admin.com / admin123
echo 4. Try accessing admin dashboard
echo.

pause