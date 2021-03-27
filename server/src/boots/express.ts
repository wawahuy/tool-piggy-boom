import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import passportConfigs from "../configs/passport";
import routerGlobals from "../routes";
import { sessionMiddleware } from "../middlewares";
import ejsHelper from "../helpers/ejs";

const app = express();

// config express
app.set("views", [
  path.join(__dirname, "../common_views"),
  path.join(__dirname, "../modules"),
]);
app.set("view engine", "ejs");
app.locals = { ...app.locals, _: ejsHelper };

// config decode
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser(passportConfigs.COOKIE_SECRET));

// config session
app.use(sessionMiddleware);
app.use(flash());

// init routers global
app.use(routerGlobals);

export default app;
