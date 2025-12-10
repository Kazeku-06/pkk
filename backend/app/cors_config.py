"""
CORS Configuration for Development
"""

def configure_cors_dev(app):
    """Configure CORS for development environment"""
    from flask_cors import CORS
    from flask import request
    
    # Primary CORS configuration
    CORS(app, 
         origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
         allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True,
         expose_headers=['Content-Type', 'Authorization'])
    
    # Backup CORS headers
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']
        
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response
    
    # Handle preflight requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            origin = request.headers.get('Origin')
            allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']
            
            if origin in allowed_origins:
                response = app.make_default_options_response()
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
                response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                return response