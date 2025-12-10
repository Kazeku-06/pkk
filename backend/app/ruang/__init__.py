from flask import Blueprint

bp = Blueprint('ruang', __name__)

from app.ruang import routes