from flask import Blueprint

bp = Blueprint('fasilitas', __name__)

from app.fasilitas import routes