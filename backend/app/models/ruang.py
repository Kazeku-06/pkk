from app import db
from datetime import datetime
import enum

class JenisRuang(enum.Enum):
    lab = "lab"
    bengkel = "bengkel"

class Ruang(db.Model):
    __tablename__ = 'ruang'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nama_ruang = db.Column(db.String(255), nullable=False)
    jenis = db.Column(db.Enum(JenisRuang), nullable=False)
    menggunakan_kunci = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    fasilitas = db.relationship('Fasilitas', backref='ruang', lazy=True, cascade='all, delete-orphan')
    laporan = db.relationship('Laporan', backref='ruang', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nama_ruang': self.nama_ruang,
            'jenis': self.jenis.value,
            'menggunakan_kunci': self.menggunakan_kunci,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'fasilitas': [f.to_dict() for f in self.fasilitas]
        }