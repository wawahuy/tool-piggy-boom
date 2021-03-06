import express, { Router } from "express";
import path from "path";
import ProxyProhibitionController from "../modules/common/proxy_prohibition/proxy_prohibition.controller";
import NotFoundController from "../modules/common/not_found/not_found.controller";
import routerAdmin from "./admin";
import routerUsers from "./user";
import routerProxy from "./proxy";
import routerApp from "./app";
import DownloadController from "../modules/common/download/download.controller";

const routerGlobals = Router();
routerGlobals.use('/assets', express.static(path.join(__dirname, '../assets')));
routerGlobals.use("/proxy_prohibition", ProxyProhibitionController.indexView);
routerGlobals.use("/download/:filename", DownloadController.download);
routerGlobals.use("/adm", routerAdmin);
routerGlobals.use("/pro", routerProxy);
routerGlobals.use("/app", routerApp);
routerGlobals.use("/", routerUsers);

/**
 * Page Not Found
 * 
 */
routerGlobals.use(NotFoundController.indexView);

export default routerGlobals;
