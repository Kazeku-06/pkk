#!/usr/bin/env python3
"""
Script untuk menjalankan aplikasi Flask
"""

import os
import sys
from app import create_app, db
from app.models.user import User, UserRole

def create_admin_user():
    """Create default admin user if not exists"""
    admin = User.query.filter_by(email='admin@admin.com').first()
    if not admin:
        admin = User(
            name='Administrator',
            email='admin@admin.com',
            role=UserRole.admin
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print('✅ Admin user created: admin@admin.com / admin123')
    else:
        print('ℹ️  Admin user already exists')

def main():
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        print('✅ Database tables created')
        
        # Create admin user
        create_admin_user()
    
    print('🚀 Starting Flask server...')
    print('📍 Backend URL: http://localhost:5000')
    print('📍 API Base: http://localhost:5000/api')
    print('🔑 Admin Login: admin@admin.com / admin123')
    print('📁 Upload folder: storage/uploads')
    print('---')
    
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()