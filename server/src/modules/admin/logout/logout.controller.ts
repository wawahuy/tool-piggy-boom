import { Request, Response } from 'express';

export default class LogoutController {
  static logout(req: Request, res: Response) {
    req.logout();
    res.redirect('/adm');
  }
}