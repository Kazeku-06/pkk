#!/usr/bin/env python3
"""
Fix database issues
"""

from app import create_app, db
from app.models.user import User, UserRole
import sys

def fix_database():
    """Fix database dan recreate admin user"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🔧 FIXING DATABASE...")
            print("=" * 50)
            
            # Drop dan recreate tables
            print("1. Dropping all tables...")
            db.drop_all()
            
            print("2. Creating all tables...")
            db.create_all()
            
            print("3. Creating admin user...")
            admin = User(
                name='Administrator',
                email='admin@admin.com',
                role=UserRole.admin
            )
            admin.set_password('admin123')
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ Database fixed successfully!")
            print("✅ Admin user: admin@admin.com / admin123")
            
            # Verify
            print("\n4. Verifying...")
            admin_check = User.query.filter_by(email='admin@admin.com').first()
            if admin_check:
                print(f"✅ Admin user verified: {admin_check.name} ({admin_check.role.value})")
                print(f"✅ Password check: {admin_check.check_password('admin123')}")
            else:
                print("❌ Admin user not found after creation")
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Database fix error: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return False

if __name__ == '__main__':
    success = fix_database()
    if success:
        print("\n🎉 Database fixed! Restart backend and try again.")
    else:
        print("\n💥 Database fix failed! Check error messages above.")
        sys.exit(1)