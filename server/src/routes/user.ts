import { Request, Response, Router } from 'express';
import { proxyProhibitionMiddleware } from '../middlewares';

const routerUsers = Router(); 
routerUsers.use(proxyProhibitionMiddleware);

routerUsers.get("/", (req: Request, res: Response) => {
  res.json({ ip: req.headers["cf-connecting-ip"] ||
  req.headers["x-forwarded-for"] ||
  req.connection.remoteAddress }).end();
});

export default routerUsers;