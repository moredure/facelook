#!/bin/sh
cd client && npm i --no-optional && npm run build
if [ $? -eq 0 ]
then
	cd ..
	docker build . -t mikefaraponov/facelook:latest
fi
