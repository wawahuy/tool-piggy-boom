import { Request, Response, NextFunction } from "express";
import appConfigs from "./../configs/app";

export const proxyProhibitionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.ipReal =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;

  next();
};
