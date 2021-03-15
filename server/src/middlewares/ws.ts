import combineMiddleware from '../helpers/combine_middleware';
import { sessionMiddleware, passportMiddleware } from "../middlewares";
import express, { Request, Response, NextFunction } from 'express';
import passportConfigs from "../configs/passport";
import cookieParser from "cookie-parser";

const authMiddleware = (req: Request, socket: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  socket.destroy();
}

export const wsMiddleware = combineMiddleware(
  express.json(),
  express.urlencoded(),
  cookieParser(passportConfigs.COOKIE_SECRET),
  sessionMiddleware,
  passportMiddleware,
  authMiddleware
);