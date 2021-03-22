import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passportConfigs from "../configs/passport";
import routerGlobals from "../routes";
import appConfigs from "../configs/app";
import { sessionMiddleware, passportMiddleware, proxyProhibitionMiddleware } from "../middlewares";

const app = express();

// config express
app.set("view engine", "ejs");
app.locals = {
  views: path.join(process.cwd(), appConfigs.IS_DEVELOPMENT ? "src" : "dist", "common_views") 
}

// config decode
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser(passportConfigs.COOKIE_SECRET));

// config passport & session
app.use(sessionMiddleware);
app.use(passportMiddleware);

// init routers global
app.use(routerGlobals);

export default app;
