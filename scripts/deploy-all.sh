#!/usr/bin/env bash

branch=origin/main
root_folder=~/heo

# pull new code
git reset --hard $branch
git fetch --all
git pull origin $branch

# deploy server
cd "$root_folder/server" || exit
chmod u+x ./deploy.sh
./deploy.sh

# deploy tools proxy
cd "$root_folder/tools/proxy-capture" || exit
chmod u+x ./deploy.sh
./deploy.sh

echo "success deploy!"




