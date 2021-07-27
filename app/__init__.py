from flask import Flask, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.exceptions import NotFound, BadRequest
from dotenv import load_dotenv
import os
import uuid
from .auth import google

# db = SQLAlchemy()
# migrate = Migrate()

def create_app(test_config=None):
    load_dotenv()

    google.load()

    app = Flask(__name__,
        static_folder=os.environ.get("FRONT_END_PATH"),
        static_url_path=f"/{uuid.uuid4()}"
    )
    app.url_map.strict_slashes = False

    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # if test_config is None:
    #     app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    #         "SQLALCHEMY_DATABASE_URI")
    # else:
    #     app.config["TESTING"] = True
    #     app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    #         "SQLALCHEMY_TEST_DATABASE_URI")

    # Import models here for Alembic setup
    # from app.models.task import Task
    # from app.models.goal import Goal

    # db.init_app(app)
    # migrate.init_app(app, db)

    # Register Blueprints here

    api = Blueprint("api", __name__, url_prefix="/api")

    from .routes import number, root, login
    api.register_blueprint(number.bp)
    api.register_blueprint(login.bp)

    app.register_blueprint(api)
    root.register(app)

    @app.errorhandler(NotFound)
    @app.errorhandler(BadRequest)
    def handle_invalid_usage(error):
        return jsonify(error.description), error.code

    CORS(app)

    return app
