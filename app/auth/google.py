import os

GOOGLE_CLIENT_ID = None
GOOGLE_CLIENT_SECRET = None
GOOGLE_DISCOVERY_URL = None

def load():
    global GOOGLE_CLIENT_ID
    global GOOGLE_CLIENT_SECRET
    global GOOGLE_DISCOVERY_URL

    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)
