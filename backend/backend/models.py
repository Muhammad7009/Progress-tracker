# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash
import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    target_days = db.Column(db.Integer, default=365)
    growth_rate = db.Column(db.Float, default=1.01)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(100),nullable = False)
    current_value = db.Column(db.Float,default = 0.0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_threshold = db.Column(db.Float,default = 32.00)
    date_started = db.Column(db.DateTime,default = datetime.datetime.utcnow)