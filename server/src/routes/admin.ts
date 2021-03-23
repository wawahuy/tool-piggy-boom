import { Router } from "express";
import { passportAdmin } from "../middlewares/passport_admin";
import { router as bullBoardRouter } from "bull-board";
import { adminLoggedMiddleware, passportAdminMiddleware } from "../middlewares";
import ppConfigs from "../configs/passport";
import AuthController from "../modules/admin/auth/auth.controller";
import HomeController from "../modules/admin/home/home.controller";
import AccountController from "../modules/admin/account/account.controller";
import LogoutController from "../modules/admin/logout/logout.controller";

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
routerAuth.get("/logout", LogoutController.logout);
routerAuth.use("/bull", bullBoardRouter);

// apply router
routerAdmin.use(adminLoggedMiddleware, routerAuth);

export default routerAdmin;
