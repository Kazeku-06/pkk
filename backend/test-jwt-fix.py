#!/usr/bin/env python3
"""
Test script to verify JWT authentication fix
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_login():
    """Test admin login"""
    print("🔍 Testing admin login...")
    
    login_data = {
        "email": "admin@admin.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('access_token')
        user = data.get('user')
        print(f"✅ Login successful!")
        print(f"User: {user.get('name')} ({user.get('role')})")
        print(f"Token: {token[:50]}...")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_jwt_endpoint(token):
    """Test JWT protected endpoint"""
    print("\n🔍 Testing JWT protected endpoint...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/users/test-jwt", headers=headers)
    print(f"JWT Test Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ JWT test successful!")
        print(f"Response: {json.dumps(data, indent=2)}")
        return True
    else:
        print(f"❌ JWT test failed: {response.text}")
        return False

def test_admin_users(token):
    """Test admin users endpoint"""
    print("\n🔍 Testing admin users endpoint...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
    print(f"Admin Users Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Admin users endpoint successful!")
        print(f"Users count: {len(data.get('users', []))}")
        return True
    else:
        print(f"❌ Admin users failed: {response.text}")
        return False

if __name__ == "__main__":
    print("🚀 Testing JWT Authentication Fix")
    print("=" * 50)
    
    # Test login
    token = test_login()
    if not token:
        exit(1)
    
    # Test JWT endpoint
    jwt_success = test_jwt_endpoint(token)
    if not jwt_success:
        exit(1)
    
    # Test admin users
    admin_success = test_admin_users(token)
    if not admin_success:
        exit(1)
    
    print("\n🎉 All tests passed! JWT authentication is working correctly.")