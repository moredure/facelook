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
    sudo sed s/#force_color_prompt=yes/force_color_prompt=yes/ --in-place ~/.bashrc
    sudo echo "sudo ln /dev/null /dev/raw1394" >> #{HOME}/.bashrc
    source $_
    sudo apt-get update
    sudo apt-get install --force-yes -y git \
      python-pip \
      libopencv-dev python-opencv
    cd #{HOME}/#{PROJECT_NAME}
    sudo pip install -r requirements.txt
  SHELL
end
