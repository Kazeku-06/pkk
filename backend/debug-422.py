#!/usr/bin/env python3
"""
Debug script untuk masalah 422 error
"""

from app import create_app, db
from app.models.user import User, UserRole
import requests
import json

def debug_database():
    """Debug database dan user"""
    app = create_app()
    
    with app.app_context():
        print("🔍 DEBUGGING DATABASE...")
        print("=" * 50)
        
        # Cek tabel
        try:
            db.create_all()
            print("✅ Database tables OK")
        except Exception as e:
            print(f"❌ Database error: {e}")
            return False
        
        # Cek admin user
        try:
            admin = User.query.filter_by(email='admin@admin.com').first()
            if admin:
                print(f"✅ Admin user exists: {admin.name} ({admin.role.value})")
            else:
                print("❌ Admin user not found, creating...")
                admin = User(
                    name='Administrator',
                    email='admin@admin.com',
                    role=UserRole.admin
                )
                admin.set_password('admin123')
                db.session.add(admin)
                db.session.commit()
                print("✅ Admin user created")
        except Exception as e:
            print(f"❌ Admin user error: {e}")
            return False
        
        # Cek semua users
        try:
            all_users = User.query.all()
            print(f"📊 Total users: {len(all_users)}")
            for user in all_users:
                print(f"   - {user.name} ({user.email}) - {user.role.value}")
        except Exception as e:
            print(f"❌ Query users error: {e}")
            return False
        
        return True

def test_login():
    """Test login endpoint"""
    print("\n🔍 TESTING LOGIN...")
    print("=" * 50)
    
    try:
        response = requests.post('http://localhost:5000/api/auth/login', 
                               json={'email': 'admin@admin.com', 'password': 'admin123'},
                               timeout=5)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"✅ Login successful, token: {token[:20]}...")
            return token
        else:
            print("❌ Login failed")
            return None
            
    except Exception as e:
        print(f"❌ Login request error: {e}")
        return None

def test_users_endpoint(token):
    """Test users endpoint dengan token"""
    print("\n🔍 TESTING USERS ENDPOINT...")
    print("=" * 50)
    
    if not token:
        print("❌ No token available")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.get('http://localhost:5000/api/admin/users', 
                              headers=headers, timeout=5)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Users endpoint working")
        else:
            print("❌ Users endpoint failed")
            
    except Exception as e:
        print(f"❌ Users request error: {e}")

def main():
    print("🚀 DEBUGGING 422 ERROR")
    print("=" * 50)
    
    # Debug database
    if not debug_database():
        print("❌ Database issues found, fix them first")
        return
    
    # Test login
    token = test_login()
    
    # Test users endpoint
    test_users_endpoint(token)
    
    print("\n" + "=" * 50)
    print("🎯 SUMMARY:")
    print("1. Check database tables and admin user")
    print("2. Test login endpoint")
    print("3. Test users endpoint with JWT token")
    print("4. If all OK, restart backend and try again")

if __name__ == '__main__':
    main()