from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token,get_jwt_identity,jwt_required
from models import db, User # Assuming your User model is in models.py
from flask_bcrypt import Bcrypt

# Create the Blueprint
auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "User already exists"}), 400

    # Create new user and hash the password
    new_user = User(username=username)
    new_user.set_password(password) # We'll define this helper in the Model
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_name = data.get('username',"")
    user = User.query.filter_by(username=user_name).first()

    if user and user.check_password(data.get('password')):
        # identity can be the user ID
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, user_id=user.id), 200

    return jsonify({"msg": "Bad username or password"}), 401