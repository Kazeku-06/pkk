from flask import Blueprint

bp = Blueprint('laporan', __name__)

from app.laporan import routes