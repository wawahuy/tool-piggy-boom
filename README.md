# tool-piggy-boom

## Deploy project server
- Start nginx với subdomain /server/nginx.conf
- Thực hiện call shell '/server/deploy.sh' tại user root
- Chú ý:
  + Thay thế user & group id trong docker compose
  + 
- Map ports:
  + 10002 (server)
  + 10003 (redis)
  + 10004 (mongodb)
  + 

## Deploy project tools - proxy capture
- Deploy tương tự project server (không cần cấu hình nginx)
- Map ports:
  + 10001 (proxy-capture)