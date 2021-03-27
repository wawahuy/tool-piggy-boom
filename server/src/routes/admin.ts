import { Router } from "express";
import { passportAdmin } from "../middlewares/passport_admin";
import { router as bullBoardRouter } from "bull-board";
import { adminLoggedMiddleware, passportAdminMiddleware } from "../middlewares";
import ppConfigs from "../configs/passport";
import AuthController from "../modules/admin/auth/auth.controller";
import HomeController from "../modules/admin/home/home.controller";
import AccountController from "../modules/admin/account/account.controller";
import LoggerController from "../modules/admin/logger/logger.controller";
import LoggerValidator from "../modules/admin/logger/logger.validator";

const routerAdmin = Router();
routerAdmin.use(passportAdminMiddleware);

// zone non-auth
routerAdmin.post("/add_account", AccountController.addAccountGame);
routerAdmin.get("/login", AuthController.loginView);
routerAdmin.use(
  "/login",
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

// apply router
routerAdmin.use(adminLoggedMiddleware, routerAuth);

export default routerAdmin;
