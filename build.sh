#!/bin/sh

cd client && npm run build
if [ $? -eq 0 ]; then
	cd ..
	docker stop $(docker ps -a -q)
	docker rm $(docker ps -a -q)
	docker rmi mikefaraponov/facelook:latest
	docker build . -t mikefaraponov/facebook:latest
fi
