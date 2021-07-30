from functools import wraps
from flask import request, current_app
import jwt
from werkzeug.exceptions import Unauthorized, BadRequest
from werkzeug.local import Local

# implementation similar to flask-jwt (https://pythonhosted.org/Flask-JWT/),
# but slightly different integration surfaces

_l = Local()
current_identity = _l('current_identity')

def default_validator(identity):
    return identity

def register_default_validator(validator):
    global default_validator
    default_validator = validator

def _jwt_required(validator):
    try:
        auth = request.headers.get("Authorization")
        kind, token = auth.split(" ")
        if kind != "JWT":
            raise Unauthorized()
        identity = jwt.decode(token, current_app.secret_key, algorithm="HS256")
        validated_record = validator(identity)
        return validated_record
    except Exception as ex:
        print(ex)
        raise Unauthorized()

def jwt_required(endpoint = None, /, *, validator = None):

    if endpoint is None or validator is None:
        validator = default_validator        

    def wrapper(fn):
        @wraps(fn)
        def inner(*args, **kwargs):
            _l.current_identity = _jwt_required(validator)
            return fn(*args, **kwargs)

        return inner

    if endpoint is None:
        return wrapper

    return wrapper(endpoint)
