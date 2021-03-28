import express from "express";
import path from "path";
import routerGlobals from "../routes";
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

// init routers global
app.use(routerGlobals);

export default app;
