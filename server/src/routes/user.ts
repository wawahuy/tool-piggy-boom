import { Request, Response, Router } from 'express';
import HomeController from '../modules/user/home/home.controller';
import { passportUserMiddleware, proxyProhibitionMiddleware, userLoggedMiddleware, zoneSessionMiddleware } from '../middlewares';

const routerUsers = Router();
routerUsers.use(zoneSessionMiddleware);
routerUsers.use(proxyProhibitionMiddleware);
routerUsers.use(passportUserMiddleware);

// zone non-auth
routerUsers.get('/', HomeController.homeView);

// zone auth
const routerAuth = Router();

// apply router
routerUsers.use(userLoggedMiddleware, routerAuth);

export default routerUsers;