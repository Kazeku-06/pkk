from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.users import bp
from app.models.user import User, UserRole
from app import db

def admin_required():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == UserRole.admin

@bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        data = request.get_json()
        
        # Validasi input
        required_fields = ['name', 'email', 'password', 'kelas']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} harus diisi'}), 400
        
        # Cek email sudah ada
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email sudah terdaftar'}), 400
        
        # Buat user baru
        user = User(
            name=data['name'],
            email=data['email'],
            role=UserRole.siswa,
            kelas=data['kelas']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User berhasil dibuat',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        users = User.query.filter_by(role=UserRole.siswa).all()
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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