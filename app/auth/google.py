import os
from authlib.integrations.flask_client import OAuth

GOOGLE_CLIENT_ID = None
GOOGLE_CLIENT_SECRET = None
GOOGLE_DISCOVERY_URL = None
GOOGLE_CONF_URL = None
oauth = None

def load(app):
    global GOOGLE_CLIENT_ID
    global GOOGLE_CLIENT_SECRET
    global GOOGLE_DISCOVERY_URL
    global GOOGLE_CONF_URL
    global oauth

    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    app.config['GOOGLE_CLIENT_ID'] = GOOGLE_CLIENT_ID 
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    app.config['GOOGLE_CLIENT_SECRET'] = GOOGLE_CLIENT_SECRET
    GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)
    # GOOGLE_CONF_URL = os.environ.get("GOOGLE_CONF_URL", None)

    oauth = OAuth(app)
    oauth.register(
        name='google',
        server_metadata_url=GOOGLE_DISCOVERY_URL,
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
