import os
from app import app
from models import db

# Create the instance folder if it doesn't exist
if not os.path.exists('instance'):
    os.makedirs('instance')
    print("Created 'instance' folder.")

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Database 'progress.db' created successfully in the instance folder!")