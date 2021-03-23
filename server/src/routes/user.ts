import { Request, Response, Router } from 'express';
import { passportUserMiddleware, proxyProhibitionMiddleware, userLoggedMiddleware } from '../middlewares';

const routerUsers = Router();
routerUsers.use(proxyProhibitionMiddleware);
routerUsers.use(passportUserMiddleware);

// zone non-auth

// zone auth
const routerAuth = Router();

// apply router
routerUsers.use(userLoggedMiddleware, routerAuth);

export default routerUsers;