#!/usr/bin/env bash
USR=$1
if [[ -z $USR ]]; then
  help
  exit 1
fi

# add user
useradd -m -d "/home/$USR" -s /bin/bash "$USR"
usermod -aG docker "$USR"

# setup ssh
mkdir "/home/$USR/.ssh"
chmod 700 "/home/$USR/.ssh"
touch "/home/$USR/.ssh/authorized_keys"
chmod 600 "/home/$USR/.ssh/authorized_keys"

# su $USR
# please add pubic key to 'authorized_keys'

# add folder data docker
mkdir "/home/$USR/data"
chown -R "$USR:users" "/home/$USR/data"