from flask import Blueprint, jsonify
from random import randint
from ..auth.jwt_endpoint import jwt_required, current_identity

bp = Blueprint("number", __name__, url_prefix="/number")

@bp.route("/", methods=("GET",))
@jwt_required
def get_number():
    print(current_identity)
    number = randint(1, 10)
    return jsonify({ "number": number }), 200
