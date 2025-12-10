#!/usr/bin/env python3
"""
Test login to isolate JWT issue
"""
import requests
import json

def test_login():
    """Test admin login"""
    print("🔍 Testing admin login...")
    
    login_data = {
        "email": "admin@admin.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"✅ Login successful!")
            print(f"Token: {token[:50]}...")
            return token
        else:
            print(f"❌ Login failed")
            return None
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None

if __name__ == "__main__":
    test_login()