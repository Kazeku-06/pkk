#!/usr/bin/env python3
"""
Test authentication flow
"""

import requests
import json

def test_login():
    """Test login dan dapatkan token"""
    print("🔍 TESTING LOGIN FLOW...")
    print("=" * 50)
    
    url = "http://localhost:5000/api/auth/login"
    data = {
        "email": "admin@admin.com",
        "password": "admin123"
    }
    
    try:
        print(f"📤 POST {url}")
        print(f"📤 Data: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=10)
        
        print(f"📥 Status: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        print(f"📥 Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            token = result.get('access_token')
            user = result.get('user')
            
            print(f"✅ Login successful!")
            print(f"✅ Token: {token[:50]}...")
            print(f"✅ User: {user['name']} ({user['role']})")
            
            return token
        else:
            print(f"❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_users_endpoint(token):
    """Test users endpoint dengan token"""
    print("\n🔍 TESTING USERS ENDPOINT...")
    print("=" * 50)
    
    if not token:
        print("❌ No token available")
        return
    
    url = "http://localhost:5000/api/admin/users"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print(f"📤 GET {url}")
        print(f"📤 Headers: {json.dumps(headers, indent=2)}")
        
        response = requests.get(url, headers=headers, timeout=10)
        
        print(f"📥 Status: {response.status_code}")
        print(f"📥 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Users endpoint working!")
        elif response.status_code == 422:
            print("❌ 422 Error - Check backend console for debug messages")
        elif response.status_code == 403:
            print("❌ 403 Forbidden - User not admin")
        elif response.status_code == 401:
            print("❌ 401 Unauthorized - Invalid token")
        else:
            print(f"❌ Unexpected error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

def test_create_user(token):
    """Test create user endpoint"""
    print("\n🔍 TESTING CREATE USER...")
    print("=" * 50)
    
    if not token:
        print("❌ No token available")
        return
    
    url = "http://localhost:5000/api/admin/users"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": "Test Siswa",
        "email": "test@siswa.com",
        "password": "password123",
        "kelas": "XI RPL 1"
    }
    
    try:
        print(f"📤 POST {url}")
        print(f"📤 Data: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, headers=headers, timeout=10)
        
        print(f"📥 Status: {response.status_code}")
        print(f"📥 Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ User created successfully!")
        else:
            print(f"❌ Create user failed")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

def main():
    print("🚀 TESTING AUTHENTICATION FLOW")
    print("=" * 60)
    
    # Test login
    token = test_login()
    
    if token:
        # Test users endpoint
        test_users_endpoint(token)
        
        # Test create user
        test_create_user(token)
    
    print("\n" + "=" * 60)
    print("🎯 INSTRUCTIONS:")
    print("1. Check backend console for debug messages")
    print("2. Look for JWT Debug and Admin Check messages")
    print("3. If 422 persists, check database connection")
    print("4. Make sure backend is running on port 5000")

if __name__ == '__main__':
    main()