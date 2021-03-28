import { Router } from "express";
import AccountGameController from "../modules/proxy/account/account.controller";
import ppConfigs from "../configs/passport";

const routerProxy = Router();
routerProxy.post("/add_account", AccountGameController.addAccountGame);
routerProxy.get('/', (req, res) => res.send('test!'));
export default routerProxy;


