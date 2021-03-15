import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectMongo from 'connect-mongo';
import passport from "passport";
import passportConfigs from "../configs/passport";
import initMiddlewarePassport from "../middlewares/passport";
import routerGlobals from "../routes";
import dbConfigs from '../configs/db';

const app = express();

// config express
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser(passportConfigs.COOKIE_SECRET));

// config passport & session
app.use(session({ 
  secret: passportConfigs.SESSION_SECRET,
  cookie: {
    maxAge: passportConfigs.SESSION_TTL * 1000
  },
  store: connectMongo.create({
    mongoUrl: dbConfigs.MONGO_URI,
    collectionName: dbConfigs.SESSION_DB,
    ttl: passportConfigs.SESSION_TTL
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// init middlewares
initMiddlewarePassport();

// init routers global
app.use(routerGlobals);

console.log('Test test remove on boots/express !!');

export default app;
