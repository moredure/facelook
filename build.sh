#!/bin/sh

cd client && npm run build
if [ $? -eq 0 ]; then
	cd ..
	docker rmi mikefaraponov/facelook:latest
	docker build . -t mikefaraponov/facebook:latest
fi
