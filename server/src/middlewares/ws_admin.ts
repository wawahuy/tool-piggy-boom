import combineMiddleware from '../helpers/combine_middleware';
import { sessionMiddleware, passportAdminMiddleware } from ".";
import express, { Request, Response, NextFunction } from 'express';
import passportConfigs from "../configs/passport";
import cookieParser from "cookie-parser";
import { IAdminDocument } from '../models/schema/admin';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    if ((<IAdminDocument>req.user)?.isAdmin) {
      return next();
    }
  }
  res.destroy();
}

export const wsAdminMiddleware = combineMiddleware(
  express.json(),
  express.urlencoded(),
  cookieParser(passportConfigs.COOKIE_SECRET),
  sessionMiddleware,
  passportAdminMiddleware,
  authMiddleware
);