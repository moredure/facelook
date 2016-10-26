#!/bin/bash

# Main packages
sudo apt-get update && sudo apt-get install --force-yes -y git \
  build-essential \
  python-pip python-dev libopencv-dev python-opencv \
  nginx uwsgi uwsgi-plugin-python \

# Install Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install python packages from requirements
cd #{HOME}/#{PROJECT_NAME}
sudo pip install -r requirements.txt

# Install Node.js packages from package.json
cd #{HOME}/#{PROJECT_NAME}/client
npm install

# Install Docker
sudo apt-get install --force-yes -y \
  apt-transport-https ca-certificates \
  linux-image-extra-$(uname -r) linux-image-extra-virtual
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" \
 | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install docker-engine
sudo service docker start
sudo groupadd docker
sudo usermod -aG docker $USER
# Then log out and log in to make changes to docker

# Color Prompt
sudo sed s/#force_color_prompt=yes/force_color_prompt=yes/ --in-place #{HOME}/.bashrc
