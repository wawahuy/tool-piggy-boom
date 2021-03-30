const configs = {
  APP_PORT: (process.env.PORT || -1) as number,
  WS_USER: '/ws',
  WS_ADMIN: '/ws_admin',
  SOCKET_JWT_SECRET: process.env.SOCKET_JWT_SECRET,
  SOCKET: process.env.SOCKET,
  ENDPOINT: process.env.ENDPOINT,
  MAIN_WORKER: process.env.MAIN_WORKER,
  IS_DEVELOPMENT: process.env.NODE_ENV == "DEVELOPMENT",
  UTC_OFFSET: "+07:00"
}

export default configs;