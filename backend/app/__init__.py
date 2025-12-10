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
    
    # Configure CORS - Direct approach
    CORS(app, 
         origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True)
    
    # Manual CORS headers as backup with debug
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        print(f"🔍 CORS Debug - Origin: {origin}, Path: {request.path}")
        
        if origin in ['http://localhost:5173', 'http://127.0.0.1:5173']:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            print(f"✅ CORS Headers added for origin: {origin}")
        else:
            print(f"❌ Origin not allowed: {origin}")
        
        return response
    
    # Handle preflight OPTIONS requests with debug
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            origin = request.headers.get('Origin')
            print(f"🚀 OPTIONS Request - Origin: {origin}, Path: {request.path}")
            
            if origin in ['http://localhost:5173', 'http://127.0.0.1:5173']:
                response = app.make_default_options_response()
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
                response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                print(f"✅ OPTIONS Response sent for: {origin}")
                return response
            else:
                print(f"❌ OPTIONS Request denied for: {origin}")
    
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