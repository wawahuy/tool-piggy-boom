# tool-piggy-boom
- Chỉnh cấu hình trong thư muc env
- Chạy dev: npm run dev (trên project proxy & server)

## Vì một số lý do cá nhân nên dữ án này sẽ được dừng phát triễn ở tiến độ 80%, chỉ phục vụ mục đích cá nhân không công đồng

## Deploy project server
- Start nginx với subdomain /server/nginx.conf
- Thực hiện call shell '/server/deploy.sh' tại user trùng với config docker
- Chú ý:
  + Thay thế user & group id trong docker compose
  + 
- Map ports:
  + 10002 (server)
  + 10003 (redis)
  + 10004 (mongodb)
  + 

## Deploy proxy server
- Deploy tương tự project server (không cần cấu hình nginx)
- Thực hiện call shell '/server/deploy.sh' tại user trùng với config docker
- Map ports:
  + 10001 (proxy-capture)

## Project proxy app
- Fork proxy core jnd tại repo: https://github.com/raise-isayan/TunProxy
- Build: react native
