from app import create_app, db
from app.models import User, Ruang, Fasilitas, Laporan
from app.models.user import UserRole

app = create_app()

@app.cli.command()
def init_db():
    """Initialize database with tables and admin user."""
    db.create_all()
    
    # Create admin user if not exists
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
        print('Admin user created: admin@admin.com / admin123')
    else:
        print('Admin user already exists')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)