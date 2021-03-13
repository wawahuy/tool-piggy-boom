const configs = {
  APP_PORT: (process.env.PORT || -1) as number,
  WS: '/ws',
  SOCKET_JWT_SECRET: process.env.SOCKET_JWT_SECRET,
}

export default configs;