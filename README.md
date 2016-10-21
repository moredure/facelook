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
Then go to host machine localhost:1337/static/index.html

## run tests
```bash
nosetests
```

## nginx config
```
server {
    listen 80;
    server_name www.facelook.com facelook.com;
    
    location / {
        root /var/www/facelook/public;
    }

    location /api {
        uwsgi_pass unix:/tmp/facelook.sock;
        uwsgi_param SCRIPT_NAME /api; 
        uwsgi_modifier1 30;
        include /etc/nginx/uwsgi_params;
    }
}
```

## uwsgi params
```sh
uwsgi --socket /tmp/facelook.sock --plugin python --wsgi-file wsgi.py  --uid www-data --gid www-data
```

## todo
>docker!!!
