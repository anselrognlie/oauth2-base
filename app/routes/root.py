import os
from flask import send_from_directory

def register(app):
    @app.route('/static/<path:path>', methods=("GET",))
    def app_static(path):
        # print(f"{path=}")
        return send_from_directory(f"{os.environ.get('FRONT_END_PATH')}/static", path)

    @app.route('/assets/<path:path>', methods=("GET",))
    def assets(path):
        # print(f"{path=}")
        return send_from_directory("assets", path)

    @app.route('/favicon.ico', methods=("GET",))
    def favicon():
        return app.send_static_file("favicon.ico")

    @app.route('/', methods=("GET",), defaults={'path': ''})
    @app.route('/<path:path>', methods=("GET",))
    def root(path):
        # print(f"{path=}")
        return app.send_static_file("index.html")
