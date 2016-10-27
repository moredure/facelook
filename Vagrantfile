# Vagrantfile for develpment
# with provision opencv and project dependencies
VAGRANT_VERSION = "2"

Vagrant.configure(VAGRANT_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder ".", "/home/vagrant/facelook"
  config.vm.box_check_update = false
  config.vm.network "forwarded_port", guest: 5000, host: 1337
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
  config.vm.provision "shell", path: "bootstrap.sh"
end
