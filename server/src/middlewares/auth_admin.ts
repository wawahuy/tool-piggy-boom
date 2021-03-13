import { Request, Response, NextFunction } from 'express';
import { IAdminDocument } from '../models/schema/admin';

export default function adminLoggedMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    if ((<IAdminDocument>req.user)?.isAdmin) {
      return next();
    }
  }
  res.redirect('/adm/login');
}