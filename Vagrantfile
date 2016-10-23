# Vagrantfile for facelook app machine
# with provision opencv and project dependencies
VAGRANT_VERSION = "2"
PROJECT_NAME = 'facelook'
HOME = '/home/vagrant'

Vagrant.configure(VAGRANT_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "#{HOME}/#{PROJECT_NAME}"
  config.vm.box_check_update = false
  config.vm.network "forwarded_port", guest: 5000, host: 1337
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update && sudo apt-get install --force-yes -y git \
      build-essential \
      python-pip python-dev \
      libopencv-dev python-opencv \
      nginx uwsgi uwsgi-plugin-python
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs
    cd #{HOME}/#{PROJECT_NAME}
    sudo pip install -r requirements.txt
    cd #{HOME}/#{PROJECT_NAME}/client
    npm install
    sudo sed s/#force_color_prompt=yes/force_color_prompt=yes/ --in-place #{HOME}/.bashrc
  SHELL
end
