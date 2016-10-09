# facelook
Face detection web-service

## up
```bash
vagrant up && vagrant ssh
```

## run dev
```bash
cd ~/facelook
export FLASK_APP=app/facelook.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0
```
Then go to host machine localhost:1337

## run tests
```bash
nosetests
```

## todo
>CI, deploy, install
