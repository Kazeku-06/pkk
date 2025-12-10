from flask import Flask, request
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
    
    # Configure CORS with explicit settings
    CORS(app, 
         origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
         allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True,
         expose_headers=['Content-Type', 'Authorization'])
    
    # Add CORS headers manually as backup
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']:
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
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
    
    # Serve uploaded files
    from flask import send_from_directory
    
    @app.route('/storage/uploads/<filename>')
    def uploaded_file(filename):
        upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', app.config['UPLOAD_FOLDER'])
        return send_from_directory(upload_dir, filename)
    
    # Test endpoint for CORS
    @app.route('/api/test', methods=['GET', 'OPTIONS'])
    def test_cors():
        return {'message': 'CORS is working!', 'origin': request.headers.get('Origin', 'No origin')}
    
    return app