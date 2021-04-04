import { Router } from "express";
import { passportAdmin } from "../middlewares/passport_admin";
import { router as bullBoardRouter } from "bull-board";
import { adminLoggedMiddleware, passportAdminMiddleware, zoneSessionMiddleware } from "../middlewares";
import ppConfigs from "../configs/passport";
import AuthController from "../modules/admin/auth/auth.controller";
import HomeController from "../modules/admin/home/home.controller";
import LoggerController from "../modules/admin/logger/logger.controller";
import LoggerValidator from "../modules/admin/logger/logger.validator";
import AuthValidator from "../modules/admin/auth/auth.validator";
import ProxyManagerController from "../modules/admin/proxy_manager/proxy_manager.controller";

const routerAdmin = Router();
routerAdmin.use(zoneSessionMiddleware);
routerAdmin.use(passportAdminMiddleware);

// zone non-auth
routerAdmin.get("/login", AuthController.loginView);
routerAdmin.use(
  "/login",
  AuthValidator.login,
  passportAdmin.authenticate(ppConfigs.AUTH_SESSION, {
    successRedirect: "/adm/",
    failureRedirect: "/adm/login",
  })
);

// zone auth
const routerAuth = Router();
routerAuth.get("/", HomeController.homeView);
routerAuth.get("/logout", AuthController.logout);
routerAuth.use("/bull", bullBoardRouter);
routerAuth.use("/logger", LoggerValidator.loggerView, LoggerController.loggerView);
routerAuth.use("/proxy_manager", ProxyManagerController.homeView);

// apply router
routerAdmin.use(adminLoggedMiddleware, routerAuth);

export default routerAdmin;
