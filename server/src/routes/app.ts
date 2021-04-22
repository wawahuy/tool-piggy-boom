import { Router } from "express";
import CheckController from "../modules/app/check/check.controller";
import ProxyController from "../modules/app/proxy/proxy.controller";

const routerApp = Router();
routerApp.get("/proxy", ProxyController.bestProxy);
routerApp.get("/check", CheckController.check);
export default routerApp;


