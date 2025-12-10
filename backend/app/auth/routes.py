from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.auth import bp
from app.models.user import User
from app import db

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"🔍 Login attempt: {data.get('email') if data else 'No data'}")
        
        if not data or not data.get('email') or not data.get('password'):
            print("❌ Missing email or password")
            return jsonify({'error': 'Email dan password harus diisi'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        print(f"🔍 User found: {user.name if user else 'None'}")
        
        if not user or not user.check_password(data['password']):
            print("❌ Invalid credentials")
            return jsonify({'error': 'Email atau password salah'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        print(f"✅ Login successful for {user.name} - Token created")
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500