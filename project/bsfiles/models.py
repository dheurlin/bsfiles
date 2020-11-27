from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(100))
    name     = db.Column(db.String(1000), unique=True)

    dropped_file = db.Column(db.String(100))
