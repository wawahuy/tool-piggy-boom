import session from "express-session";
import connectMongo from 'connect-mongo';
import dbConfigs from '../configs/db';
import passportConfigs from "../configs/passport";

export const sessionMiddleware = session({ 
  secret: passportConfigs.SESSION_SECRET,
  cookie: {
    maxAge: passportConfigs.SESSION_TTL * 1000
  },
  store: connectMongo.create({
    mongoUrl: dbConfigs.MONGO_URI,
    collectionName: dbConfigs.SESSION_DB,
    ttl: passportConfigs.SESSION_TTL
  })
});

