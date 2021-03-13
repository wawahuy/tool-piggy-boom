import { Router } from "express";
import passport from "passport";
import { router as bullBoardRouter } from "bull-board";
import adminLoggedMiddleware from "../middlewares/auth_admin";
import ppConfigs from "../configs/passport";
import AuthController from "../modules/admin/auth/auth.controller";
import HomeController from "../modules/admin/home/home.controller";
import AccountController from "../modules/admin/account/account.controller";

// zone non-auth
const routerAdmin = Router();
routerAdmin.post("/add_account", AccountController.addAccountGame);
routerAdmin.get("/login", AuthController.loginView);
routerAdmin.use(
  "/login",
  passport.authenticate(ppConfigs.AUTH_SESSION, {
    successRedirect: "/adm/",
    failureRedirect: "/adm/login",
  })
);

// zone auth
const routerAuth = Router();
routerAuth.get("/", HomeController.homeView);
routerAuth.use("/bull", bullBoardRouter);

// apply router
routerAdmin.use(adminLoggedMiddleware, routerAuth);

export default routerAdmin;
