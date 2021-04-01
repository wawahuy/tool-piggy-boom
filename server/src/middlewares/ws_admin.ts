import combineMiddleware from '../helpers/combine_middleware';
import { passportAdminMiddleware } from ".";
import express, { Request, Response, NextFunction } from 'express';
import { IAdminDocument } from '../models/schema/admin';
import { zoneSessionMiddleware } from './zone_session';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    if ((<IAdminDocument>req.user)?.isAdmin) {
      return next();
    }
  }
  res.destroy();
}

export const wsAdminMiddleware = combineMiddleware(
  zoneSessionMiddleware,
  passportAdminMiddleware,
  authMiddleware
);