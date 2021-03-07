#!/bind/bash

git fetch --all
git pull origin origin/main

# deploy
./tools/proxy-capture/deploy.sh