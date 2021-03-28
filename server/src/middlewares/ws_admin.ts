import combineMiddleware from '../helpers/combine_middleware';
import { sessionMiddleware, passportAdminMiddleware, adminLoggedMiddleware } from ".";
import express, { Request, Response, NextFunction } from 'express';
import passportConfigs from "../configs/passport";
import cookieParser from "cookie-parser";

export const wsAdminMiddleware = combineMiddleware(
  express.json(),
  express.urlencoded(),
  cookieParser(passportConfigs.COOKIE_SECRET),
  sessionMiddleware,
  passportAdminMiddleware,
  adminLoggedMiddleware
);