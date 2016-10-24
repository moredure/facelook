# facelook
Face detection web-service

## up with Docker
```sh
chmod +x build.sh
./build.sh
docker run -d --restart=always -t mikefaraponov/facelook
```

## up with Vagrant
```bash
cd ~/facelook
vagrant up && vagrant ssh
```

## build and dev
server:
```bash
cd ~/facelook
FLASK_APP=app/facelook.py FLASK_DEBUG=1 flask run --host=0.0.0.0
```
client-dev:
```bash
cd ~/facelook/client
npm run dev
```
clien-prod:
```bash
cd ~/facelook/client
npm run build
```

## run tests
```sh
nosetests
```
