from app import create_app

def raw_web_sockets():
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler

    app = create_app()

    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler,
        keyfile='key.pem', certfile='cert.pem')
    server.serve_forever()

def sockets_io():
    from app.net.channel import socketio

    app = create_app()
    socketio.run(app, async_mode='gevent', keyfile='key.pem', certfile='cert.pem')

if __name__ == "__main__":
    raw_web_sockets()