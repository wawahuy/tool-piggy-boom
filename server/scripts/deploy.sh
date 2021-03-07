#!/usr/bin/env bash

# nginx config
path_nginx=/etc/nginx/sites-enabled/heo.giayuh.com
if test -f $path_nginx; then
  rm $path_nginx
fi
cp nginx.conf $path_nginx
systemctl restart nginx


# image docker
image=zayuh/heo

# build image
docker rmi $image:build || true
docker build -t $image:build .

# docker compose run
docker-compose stop
docker-compose rm -f

docker rmi $image:lasted || true
docker tag $image:build $image:lasted

docker-compose up -d
