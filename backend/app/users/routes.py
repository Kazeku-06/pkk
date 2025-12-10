from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.users import bp
from app.models.user import User, UserRole
from app import db
import traceback

def admin_required():
    try:
        current_user_id = get_jwt_identity()
        print(f"🔍 Admin Check - User ID: {current_user_id}")
        
        if not current_user_id:
            print("❌ No user ID from JWT")
            return False
        
        # Convert string ID back to integer for database query
        user_id_int = int(current_user_id)
        user = User.query.get(user_id_int)
        if not user:
            print(f"❌ User not found for ID: {current_user_id}")
            return False
        
        is_admin = user.role == UserRole.admin
        print(f"🔍 User: {user.name} - Role: {user.role.value} - Is Admin: {is_admin}")
        
        return is_admin
    except Exception as e:
        print(f"❌ Admin check error: {e}")
        return False

@bp.route('/users', methods=['POST'])
def create_user():
    try:
        print("🔍 CREATE USER - Starting...")
        
        # Manual JWT verification
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request()
            print("✅ JWT verification passed")
        except Exception as jwt_error:
            print(f"❌ JWT verification failed: {jwt_error}")
            return jsonify({'error': f'JWT verification failed: {str(jwt_error)}'}), 422
        
        # Debug JWT
        current_user_id = get_jwt_identity()
        print(f"🔍 CREATE USER - JWT Debug - User ID: {current_user_id}")
        
        if not current_user_id:
            print("❌ No user ID from JWT")
            return jsonify({'error': 'Token tidak valid'}), 422
        
        try:
            # Convert string ID back to integer for database query
            user_id_int = int(current_user_id)
            current_user = User.query.get(user_id_int)
            print(f"✅ Database query successful for user ID: {user_id_int}")
        except ValueError as val_error:
            print(f"❌ Invalid user ID format: {current_user_id}")
            return jsonify({'error': f'Invalid user ID format: {str(val_error)}'}), 422
        except Exception as db_error:
            print(f"❌ Database query failed: {db_error}")
            return jsonify({'error': f'Database error: {str(db_error)}'}), 500
            
        if not current_user:
            print(f"❌ User not found for ID: {current_user_id}")
            return jsonify({'error': 'User tidak ditemukan'}), 422
        
        print(f"🔍 Current User: {current_user.name} - Role: {current_user.role.value}")
        
        if current_user.role != UserRole.admin:
            print(f"❌ User is not admin: {current_user.role.value}")
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        try:
            data = request.get_json()
            print(f"🔍 Create user data: {data}")
        except Exception as json_error:
            print(f"❌ JSON parsing failed: {json_error}")
            return jsonify({'error': f'Invalid JSON: {str(json_error)}'}), 400
        
        # Validasi input
        required_fields = ['name', 'email', 'password', 'kelas']
        for field in required_fields:
            if not data or not data.get(field):
                print(f"❌ Missing field: {field}")
                return jsonify({'error': f'{field} harus diisi'}), 400
        
        # Cek email sudah ada
        try:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                print(f"❌ Email already exists: {data['email']}")
                return jsonify({'error': 'Email sudah terdaftar'}), 400
        except Exception as check_error:
            print(f"❌ Email check failed: {check_error}")
            return jsonify({'error': f'Email check error: {str(check_error)}'}), 500
        
        # Buat user baru
        try:
            user = User(
                name=data['name'],
                email=data['email'],
                role=UserRole.siswa,
                kelas=data['kelas']
            )
            user.set_password(data['password'])
            print("✅ User object created")
        except Exception as create_error:
            print(f"❌ User creation failed: {create_error}")
            return jsonify({'error': f'User creation error: {str(create_error)}'}), 500
        
        try:
            db.session.add(user)
            db.session.commit()
            print(f"✅ User saved to database: {user.name}")
        except Exception as save_error:
            print(f"❌ Database save failed: {save_error}")
            db.session.rollback()
            return jsonify({'error': f'Database save error: {str(save_error)}'}), 500
        
        try:
            user_dict = user.to_dict()
            print("✅ User dict created")
        except Exception as dict_error:
            print(f"❌ User dict creation failed: {dict_error}")
            return jsonify({'error': f'User dict error: {str(dict_error)}'}), 500
        
        return jsonify({
            'message': 'User berhasil dibuat',
            'user': user_dict
        }), 201
        
    except Exception as e:
        print(f"❌ Unexpected error in create_user: {str(e)}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        try:
            db.session.rollback()
        except:
            pass
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@bp.route('/users', methods=['GET'])
def get_users():
    try:
        print("🔍 GET USERS - Starting...")
        
        # Manual JWT verification
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request()
            print("✅ JWT verification passed")
        except Exception as jwt_error:
            print(f"❌ JWT verification failed: {jwt_error}")
            return jsonify({'error': f'JWT verification failed: {str(jwt_error)}'}), 422
        
        # Debug JWT
        current_user_id = get_jwt_identity()
        print(f"🔍 GET USERS - JWT Debug - User ID: {current_user_id}")
        
        if not current_user_id:
            print("❌ No user ID from JWT")
            return jsonify({'error': 'Token tidak valid'}), 422
        
        try:
            # Convert string ID back to integer for database query
            user_id_int = int(current_user_id)
            current_user = User.query.get(user_id_int)
            print(f"✅ Current user query successful for user ID: {user_id_int}")
        except ValueError as val_error:
            print(f"❌ Invalid user ID format: {current_user_id}")
            return jsonify({'error': f'Invalid user ID format: {str(val_error)}'}), 422
        except Exception as db_error:
            print(f"❌ Current user query failed: {db_error}")
            return jsonify({'error': f'Database error: {str(db_error)}'}), 500
            
        if not current_user:
            print(f"❌ User not found for ID: {current_user_id}")
            return jsonify({'error': 'User tidak ditemukan'}), 422
            
        print(f"🔍 Current User: {current_user.name} - Role: {current_user.role.value}")
        
        if current_user.role != UserRole.admin:
            print(f"❌ User is not admin: {current_user.role.value}")
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        try:
            users = User.query.filter_by(role=UserRole.siswa).all()
            print(f"🔍 Found {len(users)} siswa users")
        except Exception as query_error:
            print(f"❌ Users query failed: {query_error}")
            return jsonify({'error': f'Users query error: {str(query_error)}'}), 500
        
        try:
            users_list = [user.to_dict() for user in users]
            print("✅ Users list created")
        except Exception as dict_error:
            print(f"❌ Users dict creation failed: {dict_error}")
            return jsonify({'error': f'Users dict error: {str(dict_error)}'}), 500
        
        return jsonify({
            'users': users_list
        }), 200
        
    except Exception as e:
        print(f"❌ Unexpected error in get_users: {str(e)}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e), 'type': type(e).__name__, 'traceback': traceback.format_exc()}), 500

@bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if data.get('name'):
            user.name = data['name']
        if data.get('email'):
            # Cek email sudah ada (kecuali email user sendiri)
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Email sudah terdaftar'}), 400
            user.email = data['email']
        if data.get('kelas'):
            user.kelas = data['kelas']
        if data.get('password'):
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User berhasil diupdate',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        user = User.query.get_or_404(user_id)
        
        if user.role == UserRole.admin:
            return jsonify({'error': 'Tidak dapat menghapus admin'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User berhasil dihapus'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/test-jwt', methods=['GET'])
def test_jwt():
    """Test endpoint untuk debug JWT"""
    try:
        # Manual JWT verification
        from flask_jwt_extended import verify_jwt_in_request
        verify_jwt_in_request()
        
        current_user_id = get_jwt_identity()
        print(f"🔍 TEST JWT - User ID: {current_user_id}")
        
        if not current_user_id:
            return jsonify({'error': 'No user ID from JWT', 'user_id': current_user_id}), 422
        
        # Convert string ID back to integer for database query
        user_id_int = int(current_user_id)
        current_user = User.query.get(user_id_int)
        if not current_user:
            return jsonify({'error': 'User not found', 'user_id': current_user_id}), 422
        
        return jsonify({
            'message': 'JWT working!',
            'user_id': current_user_id,
            'user': current_user.to_dict(),
            'is_admin': current_user.role == UserRole.admin
        }), 200
        
    except Exception as e:
        print(f"❌ JWT Test Error: {str(e)}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500