from flask import Blueprint, jsonify, request, current_app
import json
from random import randint
import requests
from ..auth.google import (
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DISCOVERY_URL
)
from oauthlib.oauth2 import WebApplicationClient

bp = Blueprint("login", __name__, url_prefix="/login")

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@bp.route("/", methods=("GET",))
def get_uri():
    # auth logic from https://realpython.com/flask-google-login/

    # OAuth 2 client setup
    client = WebApplicationClient(GOOGLE_CLIENT_ID)

    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    # print(google_provider_cfg)
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    parts = request.referrer.split('/')
    # print(parts)
    referrer = '/'.join(parts[:3])

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=referrer + "/auth/google",
        scope=["openid", "email", "profile"],
    )
    return jsonify({"redirect_uri": request_uri})

@bp.route("/auth", methods=("GET",))
def get_auth():
    # auth logic from https://realpython.com/flask-google-login/

    # Get authorization code Google sent back to you
    code = request.args.get("code")
    # print(f"{code=}")

    # OAuth 2 client setup
    client = WebApplicationClient(GOOGLE_CLIENT_ID)

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    referrer = '/'.join(request.referrer.split('/')[:3])

    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=referrer + "/auth/google",
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens!
    # print(json.dumps(token_response.json()))
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return jsonify(dict(
            details="User email not available or not verified by Google.",
            email=None
        )), 400

    return jsonify(dict(
        email=users_email
    )), 200
