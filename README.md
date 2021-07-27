# OAuth Sample

## Generate self-signed cert

```
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

## Trust self-signed cert

```
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./cert.pem
```

## Run flask with certs

```
flask run --cert=cert.pem --key=key.pem
```

## Run gunicorn with certs

```
gunicorn --certfile cert.pem --keyfile key.pem "app:create_app()"
```

## Run yarn with certs

```
HTTPS=true yarn start
```
