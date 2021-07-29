from functools import wraps
from flask import request, current_app
import jwt
from werkzeug.exceptions import Unauthorized, BadRequest
from werkzeug.local import Local, LocalProxy

# implementation similar to flask-jwt (https://pythonhosted.org/Flask-JWT/),
# but slightly different integration surfaces

_l = Local()
current_identity = _l('current_identity')

def _jwt_required():
    try:
        auth = request.headers.get("Authorization")
        kind, token = auth.split(" ")
        if kind != "JWT":
            raise Unauthorized()
        identity = jwt.decode(token, current_app.secret_key, algorithm="HS256")
        return identity
    except Exception as ex:
        print(ex)
        raise Unauthorized()

def jwt_required(fn):
    @wraps(fn)
    def inner(*args, **kwargs):
        _l.current_identity = _jwt_required()
        return fn(*args, **kwargs)

    return inner

