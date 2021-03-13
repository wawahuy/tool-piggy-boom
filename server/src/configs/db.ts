const configs = {
  MONGO_URI: process.env.MONGO_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PWD : process.env.REDIS_PWD,

  SESSION_DB: 'sessions'
}

export default configs;