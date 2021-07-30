import os
from functools import partial
from authlib.integrations.flask_client import OAuth
from werkzeug.local import LocalProxy

_values = {}

def _find_value(name):
    return _values.get(name)

GOOGLE_CLIENT_ID = LocalProxy(partial(_find_value, 'GOOGLE_CLIENT_ID'))
GOOGLE_CLIENT_SECRET = LocalProxy(partial(_find_value, 'GOOGLE_CLIENT_SECRET'))
GOOGLE_DISCOVERY_URL = LocalProxy(partial(_find_value, 'GOOGLE_DISCOVERY_URL'))
oauth = LocalProxy(partial(_find_value, 'oauth'))

def load(app):
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    app.config['GOOGLE_CLIENT_ID'] = GOOGLE_CLIENT_ID 
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    app.config['GOOGLE_CLIENT_SECRET'] = GOOGLE_CLIENT_SECRET
    GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)

    oauth = OAuth(app)
    oauth.register(
        name='google',
        server_metadata_url=GOOGLE_DISCOVERY_URL,
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    _values["GOOGLE_CLIENT_ID"] = GOOGLE_CLIENT_ID
    _values["GOOGLE_CLIENT_SECRET"] = GOOGLE_CLIENT_SECRET
    _values["GOOGLE_DISCOVERY_URL"] = GOOGLE_DISCOVERY_URL
    _values["oauth"] = oauth
