import express, { Router } from "express";
import ProxyProhibitionController from "../modules/proxy_prohibition/proxy_prohibition.controller";
import routerAdmin from "./admin";
import routerUsers from "./user";

const routerGlobals = Router();
routerGlobals.use("/proxy_prohibition", ProxyProhibitionController.indexView);
routerGlobals.use("/adm", routerAdmin);
routerGlobals.use("/u", routerUsers);

/**
 * Page Not Found
 * 
 */
routerGlobals.use((req, res) => res.redirect("/u"));

export default routerGlobals;
