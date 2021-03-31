import { Request, Response, NextFunction } from 'express';
import appConfigs from '../configs/app';

export const proxyLoggedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.query?.token === appConfigs.SOCKET_PROXY_TOKEN) {
    return next();
  }
  res.redirect('/u');
}