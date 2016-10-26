# facelook

## Description
Face detection web service.

## Installation

### Build Docker image
build.sh script requires pre-installed node.js/npm and docker with created user group docker for running without sudo permissions.
```sh
chmod +x build.sh
./build.sh
docker run -d --restart=always -p 80:80 -t mikefaraponov/facelook
```
Last string cause builded docker container to run in background mode and forwards it port 80 to host port 80.

### Development
This walkthrough requires pre-installed vagrant, virtual-box.
To start Vagrant image simply do next steps:
```sh
cd ~/facelook
vagrant up && vagrant ssh
```
First you need to build Js project with build npm script:
```bash
cd ~/facelook/client
npm run build
```
Or watch each changes of files to compile:
```bash
cd ~/facelook/client
npm run dev
Or to build es6/scss once for prod environment:
```
To run flask application for dev purposes:
```bash
cd ~/facelook
FLASK_APP=app/facelook.py FLASK_DEBUG=1 flask run --host=0.0.0.0
```

### Testing
For flask application:
```sh
cd ~/facelook
nosetests
```
For es6/scss client app:
```sh
cd ~/facelook/client
npm test
```
This will run unit tests for javascripts via karma test runner

## Usage
Facelook allows you to upload images or an image and then system mark all faces it find on it with blue squere or if nothing found mark image with red circle at the top left corner.

## Credits
* [@mikefaraponov](https://github.com/mikefaraponov)
* [@wildkun](https://github.com/wildkun)
