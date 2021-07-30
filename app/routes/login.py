from flask import Blueprint, jsonify, request, current_app
import json
from random import randint
import requests
from ..auth.google import oauth
import jwt
from datetime import datetime, timedelta
from ..models.user import User

def register_on_login():
    register_cookie = request.cookies.get("register")
    return json.loads(register_cookie) if register_cookie else False

# the user data returned from google includes the following data:
# {
#     'iss': 'https://accounts.google.com', 
#     'azp': 'some-digits.apps.googleusercontent.com',
#     'aud': 'some-digits.apps.googleusercontent.com',
#     'sub': 'some-digits',
#     'email': 'user@gmail.com',
#     'email_verified': True,
#     'at_hash': 'some-digest',
#     'nonce': 'some-digest',
#     'name': 'full name',
#     'picture': 'url to profile picture',
#     'given_name': 'first name',
#     'family_name': 'last naem',
#     'locale': 'en',
#     'iat': some-digits,
#     'exp': some-digits
# }

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

    user_model = get_or_make_user(user, register_on_login())

    result_user = dict(
        email=user_model.email,
        name=user_model.name,
        exp=datetime.utcnow() + timedelta(days=7)
    )

    secret = current_app.secret_key
    token = jwt.encode(result_user, secret, algorithm="HS256")

    return jsonify(dict(token=token.decode("utf-8"))), 200

def get_or_make_user(data, make=False):
    if not make:
        user = User.find_by_email(data["email"])
    else:
        user = User.from_token(data)
        user.save()

    return user