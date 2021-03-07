#!/bind/bash

git fetch --all
git pull origin origin/main

# deploy
./server/deploy.sh