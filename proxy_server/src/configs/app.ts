export const appConfigs = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'DEVELOPMENT',
  PORT: process.env.PORT,
  HOST_MGMT: process.env.HOST_MGMT,
  WS_MGMT: process.env.WS_MGMT,
  SOCKET_PROXY_TOKEN: process.env.SOCKET_PROXY_TOKEN,
  HOST_GAME: 'd2fd20abim5npz.cloudfront.net',
  API_IP_LOOKUP: 'https://api.ipify.org?format=json',
}