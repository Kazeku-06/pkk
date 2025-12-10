from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.fasilitas import bp
from app.models.user import User, UserRole
from app.models.fasilitas import Fasilitas
from app.models.ruang import Ruang
from app import db

def admin_required():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == UserRole.admin

@bp.route('/fasilitas', methods=['POST'])
@jwt_required()
def create_fasilitas():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        data = request.get_json()
        
        # Validasi input
        required_fields = ['ruang_id', 'nama_fasilitas']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} harus diisi'}), 400
        
        # Cek ruang exists
        ruang = Ruang.query.get(data['ruang_id'])
        if not ruang:
            return jsonify({'error': 'Ruang tidak ditemukan'}), 404
        
        # Buat fasilitas baru
        fasilitas = Fasilitas(
            ruang_id=data['ruang_id'],
            nama_fasilitas=data['nama_fasilitas']
        )
        
        db.session.add(fasilitas)
        db.session.commit()
        
        return jsonify({
            'message': 'Fasilitas berhasil dibuat',
            'fasilitas': fasilitas.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/fasilitas', methods=['GET'])
@jwt_required()
def get_fasilitas():
    try:
        ruang_id = request.args.get('ruang_id')
        
        if ruang_id:
            fasilitas_list = Fasilitas.query.filter_by(ruang_id=ruang_id).all()
        else:
            fasilitas_list = Fasilitas.query.all()
        
        return jsonify({
            'fasilitas': [fasilitas.to_dict() for fasilitas in fasilitas_list]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/fasilitas/<int:fasilitas_id>', methods=['DELETE'])
@jwt_required()
def delete_fasilitas(fasilitas_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        fasilitas = Fasilitas.query.get_or_404(fasilitas_id)
        
        db.session.delete(fasilitas)
        db.session.commit()
        
        return jsonify({'message': 'Fasilitas berhasil dihapus'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500