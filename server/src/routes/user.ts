import { Request, Response, Router } from 'express';
import HomeController from '../modules/user/home/home.controller';
import { passportUserMiddleware, proxyProhibitionMiddleware, userLoggedMiddleware, zoneSessionMiddleware } from '../middlewares';
import { passportUser } from '../middlewares/passport_user';
import ppConfigs from '../configs/passport';
import HomeValidator from '../modules/user/home/home.validator';

const routerUsers = Router();
routerUsers.use(zoneSessionMiddleware);
routerUsers.use(proxyProhibitionMiddleware);
routerUsers.use(passportUserMiddleware);

// zone non-auth
routerUsers.get('/', HomeController.homeView);
routerUsers.post(
  '/login',
  HomeValidator.login,
  passportUser.authenticate(ppConfigs.AUTH_SESSION, {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
  })
);

// zone auth
const routerAuth = Router();


// apply router
routerUsers.use(userLoggedMiddleware, routerAuth);

export default routerUsers;