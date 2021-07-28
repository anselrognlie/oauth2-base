from flask import Blueprint, jsonify, request, current_app
import json
from random import randint
import requests
from ..auth.google import oauth

bp = Blueprint("login", __name__, url_prefix="/login")

@bp.route("/", methods=("GET",))
def get_uri():
    parts = request.referrer.split('/')
    referrer = '/'.join(parts[:3])
    redirect_uri=referrer + "/auth/google"

    result = oauth.google.create_authorization_url(redirect_uri)
    oauth.google.save_authorize_data(request, redirect_uri=redirect_uri, **result)

    return jsonify({"redirect_uri": result['url']})

@bp.route("/auth", methods=("GET",))
def get_auth():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)

    if not user.get("email_verified"):
        return jsonify(dict(
            details="User email not available or not verified by Google.",
            email=None
        )), 400

    return jsonify(dict(
        email=user["email"]
    )), 200
