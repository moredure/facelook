# facelook
Face detection web-service

## up
```bash
cd ~/facelook
vagrant up && vagrant ssh
```

## run dev
server:
```bash
cd ~/facelook
export FLASK_APP=app/facelook.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0
```
client:
```bash
cd ~/facelook/client
npm run dev
```
Then go to host machine localhost:1337

## run tests
```bash
nosetests
```

## todo
>CI, deploy, install
