import os
from authlib.integrations.flask_client import OAuth
from werkzeug.local import Local

_l = Local()
GOOGLE_CLIENT_ID = _l('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = _l('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = _l('GOOGLE_DISCOVERY_URL')
oauth = _l('oauth')

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

    _l.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID
    _l.GOOGLE_CLIENT_SECRET = GOOGLE_CLIENT_SECRET
    _l.GOOGLE_DISCOVERY_URL = GOOGLE_DISCOVERY_URL
    _l.oauth = oauth
