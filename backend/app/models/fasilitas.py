from app import db

class Fasilitas(db.Model):
    __tablename__ = 'fasilitas'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruang_id = db.Column(db.Integer, db.ForeignKey('ruang.id'), nullable=False)
    nama_fasilitas = db.Column(db.String(255), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'ruang_id': self.ruang_id,
            'nama_fasilitas': self.nama_fasilitas
        }