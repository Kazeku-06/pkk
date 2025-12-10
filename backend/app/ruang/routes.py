from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ruang import bp
from app.models.user import User, UserRole
from app.models.ruang import Ruang, JenisRuang
from app import db

def admin_required():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return False
    try:
        # Convert string ID back to integer for database query
        user_id_int = int(current_user_id)
        user = User.query.get(user_id_int)
        return user and user.role == UserRole.admin
    except (ValueError, TypeError):
        return False

@bp.route('/ruang', methods=['POST'])
@jwt_required()
def create_ruang():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        data = request.get_json()
        
        # Validasi input
        required_fields = ['nama_ruang', 'jenis']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} harus diisi'}), 400
        
        # Validasi jenis ruang
        try:
            jenis = JenisRuang(data['jenis'])
        except ValueError:
            return jsonify({'error': 'Jenis ruang harus lab atau bengkel'}), 400
        
        # Buat ruang baru
        ruang = Ruang(
            nama_ruang=data['nama_ruang'],
            jenis=jenis,
            menggunakan_kunci=data.get('menggunakan_kunci', False)
        )
        
        db.session.add(ruang)
        db.session.commit()
        
        return jsonify({
            'message': 'Ruang berhasil dibuat',
            'ruang': ruang.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/ruang', methods=['GET'])
@jwt_required()
def get_ruang():
    try:
        ruang_list = Ruang.query.all()
        return jsonify({
            'ruang': [ruang.to_dict() for ruang in ruang_list]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/ruang/<int:ruang_id>', methods=['PUT'])
@jwt_required()
def update_ruang(ruang_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        ruang = Ruang.query.get_or_404(ruang_id)
        data = request.get_json()
        
        if data.get('nama_ruang'):
            ruang.nama_ruang = data['nama_ruang']
        if data.get('jenis'):
            try:
                ruang.jenis = JenisRuang(data['jenis'])
            except ValueError:
                return jsonify({'error': 'Jenis ruang harus lab atau bengkel'}), 400
        if 'menggunakan_kunci' in data:
            ruang.menggunakan_kunci = data['menggunakan_kunci']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Ruang berhasil diupdate',
            'ruang': ruang.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/ruang/<int:ruang_id>', methods=['DELETE'])
@jwt_required()
def delete_ruang(ruang_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        ruang = Ruang.query.get_or_404(ruang_id)
        
        db.session.delete(ruang)
        db.session.commit()
        
        return jsonify({'message': 'Ruang berhasil dihapus'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500