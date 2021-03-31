import combineMiddleware from '../helpers/combine_middleware';
import express, { Request, Response, NextFunction } from 'express';
import appConfigs from '../configs/app';
import url from 'url';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const u = url.parse(req.url);
  if (u.query === 'token=' + appConfigs.SOCKET_PROXY_TOKEN) {
    return next();
  }
  res.destroy();
}

export const wsProxyMiddleware = combineMiddleware(
  authMiddleware
);