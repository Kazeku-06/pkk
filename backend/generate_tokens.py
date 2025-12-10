#!/usr/bin/env python3
"""
Script untuk generate secret keys yang aman
"""

import secrets
import string

def generate_secret_key(length=32):
    """Generate random secret key"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_jwt_secret(length=64):
    """Generate JWT secret key"""
    return secrets.token_urlsafe(length)

if __name__ == "__main__":
    print("🔐 GENERATING SECURE TOKENS")
    print("=" * 50)
    
    secret_key = generate_secret_key(32)
    jwt_secret = generate_jwt_secret(64)
    
    print(f"SECRET_KEY={secret_key}")
    print(f"JWT_SECRET_KEY={jwt_secret}")
    
    print("\n📋 Copy tokens di atas ke file .env Anda")
    print("=" * 50)
    
    # Auto update .env file
    try:
        with open('.env', 'r') as f:
            content = f.read()
        
        # Replace tokens
        lines = content.split('\n')
        new_lines = []
        
        for line in lines:
            if line.startswith('SECRET_KEY='):
                new_lines.append(f'SECRET_KEY={secret_key}')
            elif line.startswith('JWT_SECRET_KEY='):
                new_lines.append(f'JWT_SECRET_KEY={jwt_secret}')
            else:
                new_lines.append(line)
        
        with open('.env', 'w') as f:
            f.write('\n'.join(new_lines))
        
        print("✅ File .env berhasil diupdate dengan token baru!")
        
    except FileNotFoundError:
        print("⚠️  File .env tidak ditemukan. Silakan copy manual.")
    except Exception as e:
        print(f"⚠️  Error updating .env: {e}")
        print("Silakan copy token manual ke file .env")