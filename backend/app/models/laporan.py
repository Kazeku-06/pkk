from app import db
from datetime import datetime
import enum
import json

class StatusLaporan(enum.Enum):
    pending = "pending"
    disetujui = "disetujui"
    ditolak = "ditolak"

class Laporan(db.Model):
    __tablename__ = 'laporan'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ruang_id = db.Column(db.Integer, db.ForeignKey('ruang.id'), nullable=False)
    foto_kegiatan = db.Column(db.String(255), nullable=False)
    foto_kunci = db.Column(db.String(255), nullable=True)
    jam_pelajaran = db.Column(db.Integer, nullable=False)
    fasilitas_digunakan = db.Column(db.JSON, nullable=False)
    keterangan = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(StatusLaporan), default=StatusLaporan.pending)
    alasan_penolakan = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'user_kelas': self.user.kelas if self.user else None,
            'ruang_id': self.ruang_id,
            'ruang_nama': self.ruang.nama_ruang if self.ruang else None,
            'foto_kegiatan': self.foto_kegiatan,
            'foto_kunci': self.foto_kunci,
            'jam_pelajaran': self.jam_pelajaran,
            'fasilitas_digunakan': self.fasilitas_digunakan,
            'keterangan': self.keterangan,
            'status': self.status.value,
            'alasan_penolakan': self.alasan_penolakan,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }