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
import AppVersionController from "../modules/admin/app_version/app_version.controller";
import AppVersionValidator from "../modules/admin/app_version/app_version.validator";

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
routerAuth.get("/logger", LoggerValidator.loggerView, LoggerController.loggerView);
routerAuth.get("/proxy_manager", ProxyManagerController.homeView);
routerAuth.get("/app_version", AppVersionController.appVersionView);
routerAuth.post("/app_version", AppVersionValidator.appVersionForm, AppVersionController.uploadMiddleware, AppVersionController.appVersionUpdate);
routerAuth.use("/bull", bullBoardRouter);

// apply router
routerAdmin.use(adminLoggedMiddleware, routerAuth);

export default routerAdmin;
