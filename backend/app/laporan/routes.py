from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.laporan import bp
from app.models.user import User, UserRole
from app.models.laporan import Laporan, StatusLaporan
from app.models.ruang import Ruang
from app import db
import os
import json
from datetime import datetime
import uuid

def admin_required():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == UserRole.admin

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Create upload path
        upload_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), 
            '..', '..', 
            current_app.config['UPLOAD_FOLDER']
        )
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        return unique_filename
    return None

@bp.route('/laporan', methods=['POST'])
@jwt_required()
def create_laporan():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != UserRole.siswa:
            return jsonify({'error': 'Akses ditolak. Hanya siswa yang dapat membuat laporan'}), 403
        
        # Validasi form data
        if 'foto_kegiatan' not in request.files:
            return jsonify({'error': 'Foto kegiatan harus diupload'}), 400
        
        foto_kegiatan_file = request.files['foto_kegiatan']
        if foto_kegiatan_file.filename == '':
            return jsonify({'error': 'Foto kegiatan harus diupload'}), 400
        
        # Validasi data lainnya
        ruang_id = request.form.get('ruang_id')
        jam_pelajaran = request.form.get('jam_pelajaran')
        fasilitas_digunakan = request.form.get('fasilitas_digunakan')
        keterangan = request.form.get('keterangan')
        
        if not all([ruang_id, jam_pelajaran, fasilitas_digunakan, keterangan]):
            return jsonify({'error': 'Semua field harus diisi'}), 400
        
        # Cek ruang exists
        ruang = Ruang.query.get(ruang_id)
        if not ruang:
            return jsonify({'error': 'Ruang tidak ditemukan'}), 404
        
        # Save foto kegiatan
        foto_kegiatan_filename = save_file(foto_kegiatan_file)
        if not foto_kegiatan_filename:
            return jsonify({'error': 'Format foto kegiatan tidak valid'}), 400
        
        # Save foto kunci jika ada dan ruang menggunakan kunci
        foto_kunci_filename = None
        if ruang.menggunakan_kunci:
            if 'foto_kunci' not in request.files:
                return jsonify({'error': 'Foto kunci harus diupload untuk ruang ini'}), 400
            
            foto_kunci_file = request.files['foto_kunci']
            if foto_kunci_file.filename == '':
                return jsonify({'error': 'Foto kunci harus diupload untuk ruang ini'}), 400
            
            foto_kunci_filename = save_file(foto_kunci_file)
            if not foto_kunci_filename:
                return jsonify({'error': 'Format foto kunci tidak valid'}), 400
        
        # Parse fasilitas digunakan
        try:
            fasilitas_list = json.loads(fasilitas_digunakan)
        except json.JSONDecodeError:
            return jsonify({'error': 'Format fasilitas digunakan tidak valid'}), 400
        
        # Buat laporan baru
        laporan = Laporan(
            user_id=current_user_id,
            ruang_id=int(ruang_id),
            foto_kegiatan=foto_kegiatan_filename,
            foto_kunci=foto_kunci_filename,
            jam_pelajaran=int(jam_pelajaran),
            fasilitas_digunakan=fasilitas_list,
            keterangan=keterangan,
            status=StatusLaporan.pending
        )
        
        db.session.add(laporan)
        db.session.commit()
        
        return jsonify({
            'message': 'Laporan berhasil dibuat',
            'laporan': laporan.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/laporan/me', methods=['GET'])
@jwt_required()
def get_my_laporan():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != UserRole.siswa:
            return jsonify({'error': 'Akses ditolak. Hanya siswa yang dapat mengakses'}), 403
        
        laporan_list = Laporan.query.filter_by(user_id=current_user_id).order_by(Laporan.created_at.desc()).all()
        
        return jsonify({
            'laporan': [laporan.to_dict() for laporan in laporan_list]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/laporan', methods=['GET'])
@jwt_required()
def get_admin_laporan():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        # Filter berdasarkan status (default: pending)
        status = request.args.get('status', 'pending')
        
        try:
            status_enum = StatusLaporan(status)
        except ValueError:
            return jsonify({'error': 'Status tidak valid'}), 400
        
        laporan_list = Laporan.query.filter_by(status=status_enum).order_by(Laporan.created_at.desc()).all()
        
        return jsonify({
            'laporan': [laporan.to_dict() for laporan in laporan_list]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/laporan/<int:laporan_id>', methods=['GET'])
@jwt_required()
def get_laporan_detail(laporan_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        laporan = Laporan.query.get_or_404(laporan_id)
        
        return jsonify({
            'laporan': laporan.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/laporan/<int:laporan_id>/approve', methods=['PUT'])
@jwt_required()
def approve_laporan(laporan_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        laporan = Laporan.query.get_or_404(laporan_id)
        
        laporan.status = StatusLaporan.disetujui
        laporan.alasan_penolakan = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Laporan berhasil disetujui',
            'laporan': laporan.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/laporan/<int:laporan_id>/reject', methods=['PUT'])
@jwt_required()
def reject_laporan(laporan_id):
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        data = request.get_json()
        alasan = data.get('alasan_penolakan')
        
        if not alasan:
            return jsonify({'error': 'Alasan penolakan harus diisi'}), 400
        
        laporan = Laporan.query.get_or_404(laporan_id)
        
        laporan.status = StatusLaporan.ditolak
        laporan.alasan_penolakan = alasan
        
        db.session.commit()
        
        return jsonify({
            'message': 'Laporan berhasil ditolak',
            'laporan': laporan.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/laporan/history', methods=['GET'])
@jwt_required()
def get_laporan_history():
    try:
        if not admin_required():
            return jsonify({'error': 'Akses ditolak. Hanya admin yang dapat mengakses'}), 403
        
        query = Laporan.query
        
        # Filter berdasarkan parameter
        tanggal = request.args.get('tanggal')
        kelas = request.args.get('kelas')
        ruang_id = request.args.get('ruang_id')
        status = request.args.get('status')
        user_id = request.args.get('user_id')
        
        if tanggal:
            try:
                filter_date = datetime.strptime(tanggal, '%Y-%m-%d').date()
                query = query.filter(db.func.date(Laporan.created_at) == filter_date)
            except ValueError:
                return jsonify({'error': 'Format tanggal tidak valid (YYYY-MM-DD)'}), 400
        
        if kelas:
            query = query.join(User).filter(User.kelas == kelas)
        
        if ruang_id:
            query = query.filter(Laporan.ruang_id == ruang_id)
        
        if status:
            try:
                status_enum = StatusLaporan(status)
                query = query.filter(Laporan.status == status_enum)
            except ValueError:
                return jsonify({'error': 'Status tidak valid'}), 400
        
        if user_id:
            query = query.filter(Laporan.user_id == user_id)
        
        laporan_list = query.order_by(Laporan.created_at.desc()).all()
        
        return jsonify({
            'laporan': [laporan.to_dict() for laporan in laporan_list]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500