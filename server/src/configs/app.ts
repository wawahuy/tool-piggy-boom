import { join } from "path";

const configs = {
  APP_PORT: (process.env.PORT || -1) as number,
  WS_USER: '/ws',
  WS_ADMIN: '/ws_admin',
  WS_PROXY: '/ws_proxy',
  SOCKET_PROXY_TOKEN: process.env.SOCKET_PROXY_TOKEN,
  SOCKET_JWT_SECRET: process.env.SOCKET_JWT_SECRET,
  SOCKET: process.env.SOCKET,
  ENDPOINT: process.env.ENDPOINT,
  MAIN_WORKER: process.env.MAIN_WORKER,
  IS_DEVELOPMENT: process.env.NODE_ENV == "DEVELOPMENT",
  UTC_OFFSET: "+07:00",
  UPLOAD_DIR: process.env.NODE_ENV == "DEVELOPMENT" ? join(__dirname, "../../uploads") : '/data/uploads'
}

export default configs;