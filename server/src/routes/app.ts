import { Router } from "express";
import ProxyController from "../modules/app/proxy/proxy.controller";

const routerApp = Router();
routerApp.get("/proxy", ProxyController.bestProxy);
export default routerApp;


