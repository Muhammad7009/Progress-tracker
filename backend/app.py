from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_jwt_extended import JWTManager,jwt_required, get_jwt_identity
from auth import auth_bp
from models import db, User, Progress
from auth import auth_bp
import os
from dotenv import load_dotenv
import math
from datetime import datetime,timedelta
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})#This allows the frontend to access the API
basedir = os.path.abspath(os.path.dirname(__file__))
# We use the 'instance' folder to avoid file conflicts
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'  + os.path.join(basedir, 'instance', 'progress.db') #
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
# Essential JWT Setup
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SCRET_KEY')
 # Change this in production!
jwt = JWTManager(app)
db.init_app(app)

# Register the Blueprint
# All routes in auth.py will now start with /api/auth
app.register_blueprint(auth_bp, url_prefix='/api/auth')
@app.route('/dashboard')
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(user=current_user)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "message": "Backend is running!"})
    # return jsonify({"Message": "Progress saved succesfully"}),201 
@app.route('/api/progress', methods=["GET","POST"])
def add_progress():
    data = request.json
    user_id = data.get('user_id') 
    
    if not user_id:
        return jsonify({"error": "Missing user_id. Who does this progress belong to?"}), 400
    new_log = Progress(
        task_name=data['task_name'],
        current_value=data.get('current_value', 0.0),
        target_threshold=data.get('target_threshold', 32.0),
        user_id=data['user_id'] # CRITICAL: Linking the foreign key
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({"message": "Progress recorded!"}), 201

@app.route('/api/progress/graph/<int:user_id>', methods=['GET'])
@jwt_required()
def get_plateau_data(user_id):
    
    user = User.query.get_or_404(user_id)
    logs = Progress.query.filter_by(user_id=user.id).order_by(Progress.date_started).all()
    timespan = int(user.target_days) 
    # 1. Calculate how many days have passed since the first log
    first_log_date = logs[0].date_started.date() if logs else datetime.utcnow().date()
    today = datetime.utcnow().date()
    days_since_start = (today - first_log_date).days + 1
    final_value = math.pow(1.01,timespan)
    graph_data = []
    running_total = 0
    
    # Map logs to their specific day number
    daily_progress = {}
    for log in logs:
        day_index = (log.date_started.date() - first_log_date).days + 1
        daily_progress[day_index] = daily_progress.get(day_index, 0) + log.current_value

    for day in range(1,timespan + 1):
        # The Ghost Line (What is possible)
        theoretical = math.pow(1.01, day)
        
        # The Solid Line (Reality)
        actual_val = None
        # hope_line = ((theoretical)/(timespan - 1)) *day +1
        hope_line = ((final_value - 1)* (day/timespan)) + 1 

        if  day <= sum([log.current_value for log in logs]):
            # We add today's work to the total accumulated from previous days
            running_total += daily_progress.get(day, 0)
            actual_val = round(math.pow(1.01,day),4)
            
        graph_data.append({
            "day": day,
            "theoretical": round(theoretical,4),
            "actual": actual_val,
            "hope": (((0.5)*final_value - 1)/timespan)*day + 1
        })
        
    return jsonify(graph_data)
        
    
@app.route('/api/progress/<int:user_id>', methods=['POST'])
def get_user_progress(user_id):
    user = User.query.get_or_404(user_id)
    # Because of backref='owner', we can just access user.logs
    output = []
    for log in user.logs:
        output.append({
            "id": log.id,
            "task_name": log.task_name,
            "current_value": log.current_value,
            "target_threshold": log.target_threshold,
            "date": log.date_started.strftime("%Y-%m-%d")
        })
    return jsonify(output)
@app.route('/api/user/settings/<int:user_id>',methods = ["PUT"])
def update_settings(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    if "target_days" in data:
        user.target_days = int(data["target_days"])
    db.session.commit()
    return jsonify({"message":"Settings update successfully!"})
@app.route('/api/progress/<int:id>', methods = ["DELETE"])
def delete_progress(id):
    item_to_delete = Progress.query.get_or_404(id)
    db.session.delete(item_to_delete)
    db.session.commit()
    return jsonify({"Message":f"Progress entry {id} deleted successfully"}),200
# @app.route("/api/progress/verify", methods = ["GET"])
# def verify():
if __name__ == '__main__':
    app.run(host = "0.0.0.0",port=5000,debug=True)