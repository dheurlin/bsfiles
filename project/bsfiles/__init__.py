from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

import os

db = SQLAlchemy()
migrate = None

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET')
    PG_USER = os.environ.get('POSTGRES_USER')
    PG_DB = os.environ.get('POSTGRES_DB')
    PG_PASS = os.environ.get('POSTGRES_PASSWORD')
    PG_PORT = os.environ.get('DB_PORT')
    app.config['SQLALCHEMY_DATABASE_URI'] = \
        f'postgresql+psycopg2://{PG_USER}:{PG_PASS}@db:{PG_PORT}/{PG_DB}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = '/uploads'

    db.init_app(app)

    # Set up flask_login
    login_manager = LoginManager()
    login_manager.login_view = 'main.login'
    login_manager.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Set up migrations
    migrate = Migrate(app, db, directory='/project/migrations')

    # Register routes
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
