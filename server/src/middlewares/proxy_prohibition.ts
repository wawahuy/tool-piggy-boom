import { Request, Response, NextFunction } from "express";
import ModelIPProxy from "../models/schema/ip_proxy";
import appConfigs from "./../configs/app";

export const proxyProhibitionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.ipReal =
    req.headers["cf-connecting-ip"]?.toString() ||
    req.headers["x-forwarded-for"]?.toString() ||
    req.connection.remoteAddress;

  if (await ModelIPProxy.findOne({ ipAddress: req.ipReal })) {
    req.isProxyProhibition = true;
    return res.redirect("/proxy_prohibition")
  }

  next();
};
