from flask import Blueprint, jsonify
from random import randint

bp = Blueprint("number", __name__, url_prefix="/number")

@bp.route("/", methods=("GET",))
def get_number():
    number = randint(1, 10)
    return jsonify({ "number": number }), 200
