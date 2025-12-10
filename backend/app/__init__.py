from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Create upload directory
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', app.config['UPLOAD_FOLDER'])
    os.makedirs(upload_dir, exist_ok=True)
    
    # Register blueprints
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from app.users import bp as users_bp
    app.register_blueprint(users_bp, url_prefix='/api/admin')
    
    from app.ruang import bp as ruang_bp
    app.register_blueprint(ruang_bp, url_prefix='/api/admin')
    
    from app.fasilitas import bp as fasilitas_bp
    app.register_blueprint(fasilitas_bp, url_prefix='/api/admin')
    
    from app.laporan import bp as laporan_bp
    app.register_blueprint(laporan_bp, url_prefix='/api')
    
    return app