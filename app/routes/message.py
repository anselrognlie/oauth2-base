from flask import Blueprint, jsonify, request
from ..auth.jwt_endpoint import jwt_required, jwt_ws, current_identity
from ..models.message import Message
from ..net.channel import socketio

bp = Blueprint("messages", __name__, url_prefix="/messages")

@bp.route("/", methods=("GET",))
@jwt_required
def get_public_messages():
    since = request.args.get("since")
    latestId = request.args.get("latestId")
    messages = Message.find_public_messages(since=since, latestId=latestId)
    return jsonify([m.to_json_dict() for m in messages]), 200

@bp.route("/", methods=("POST",))
@jwt_required
def send_message():
    request_body = request.get_json()
    message = Message.from_dict(request_body)
    message.save()
    return jsonify(message.to_json_dict()), 201

@socketio.event
@jwt_ws
def send_message(data):
    print(current_identity)
    print(data)