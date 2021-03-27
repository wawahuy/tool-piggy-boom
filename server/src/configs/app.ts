const configs = {
  APP_PORT: (process.env.PORT || -1) as number,
  WS: '/ws',
  SOCKET_JWT_SECRET: process.env.SOCKET_JWT_SECRET,
  MAIN_WORKER: process.env.MAIN_WORKER,
  IS_DEVELOPMENT: process.env.NODE_ENV == "DEVELOPMENT",
  UTC_OFFSET: "+07:00"
}

export default configs;