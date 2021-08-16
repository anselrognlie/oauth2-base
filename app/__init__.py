from flask import Flask, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.exceptions import NotFound, BadRequest, Unauthorized
from dotenv import load_dotenv
import os
import uuid
from .auth import google
from .util.string import utf8_string
from .auth.jwt_endpoint import register_default_validator
from .data.storage import db, migrate
from .net.channel import socketio
from .models import *
from .auth.user_validator import validate
from .routes import number, root, login, message

def create_app(test_config=None):
    load_dotenv()

    app = Flask(__name__,
        static_folder=os.environ.get("FRONT_END_PATH"),
        static_url_path=f"/{uuid.uuid4()}"
    )
    app.url_map.strict_slashes = False
    app.secret_key = utf8_string(os.environ.get("SECRET_KEY", ''))

    google.load(app)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    if test_config is None:
        app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
            "SQLALCHEMY_DATABASE_URI")
    else:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
            "SQLALCHEMY_DATABASE_URI_TEST")

    # Import models here for Alembic setup
    register_default_validator(validate)

    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)

    # Register Blueprints here

    api = Blueprint("api", __name__, url_prefix="/api")

    api.register_blueprint(number.bp)
    api.register_blueprint(login.bp)
    api.register_blueprint(message.bp)

    app.register_blueprint(api)
    root.register(app)

    @app.errorhandler(NotFound)
    @app.errorhandler(BadRequest)
    @app.errorhandler(Unauthorized)
    def handle_invalid_usage(error):
        return jsonify(error.description), error.code

    CORS(app)

    return app
