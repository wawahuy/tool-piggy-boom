import express, { Router } from "express";
import ProxyProhibitionController from "../modules/proxy_prohibition/home/proxy_prohibition.controller";
import routerAdmin from "./admin";
import routerUsers from "./user";

const routerGlobals = Router();
routerGlobals.use("/proxy_prohibition", ProxyProhibitionController.indexView);
routerGlobals.use("/adm", routerAdmin);
routerGlobals.use("/", routerUsers);

export default routerGlobals;
